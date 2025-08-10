const Message = require('../models/message.model');
const User = require('../models/user-model');
const { getReciverSocketId, io } = require("../lib/socket");

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    const usersOtherThanCurrentUser = users.filter(user => user._id.toString() !== req.user._id.toString());
    res.status(200).json(usersOtherThanCurrentUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching users' });
  }
}

module.exports.getMessages = async (req, res) => {
  try {
    const {id : userId } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id }
      ]
    }).populate('sender', 'name email').populate('receiver', 'name email').sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
}

module.exports.sendMessage = async (req, res) => {
  try {
    const { id : receiverId } = req.params;
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Content is required' });
    }
    if(!receiverId) {
      return res.status(400).json({ message: 'Receiver ID is required' });
    }
    const message = new Message({
      sender: req.user._id,
      receiver: receiverId,
      content: content
    });
    await message.save();
    
    // Populate the message with sender and receiver info for real-time updates
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email username')
      .populate('receiver', 'name email username');
    
    // Get socket IDs for both sender and receiver
    const receiverSocketId = getReciverSocketId(receiverId);
    const senderSocketId = getReciverSocketId(req.user._id.toString());
    
    // Emit to receiver if online
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", populatedMessage);
    }
    
    // Emit back to sender to confirm message was sent (for real-time update)
    if (senderSocketId) {
      io.to(senderSocketId).emit("messageSent", populatedMessage);
    }
    
    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending message' });
  }
}