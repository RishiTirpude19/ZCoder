const Chat = require("../models/chat-schema");

module.exports.accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("User ID not provided in the request body.");
    return res.status(400).json({ success: false, errorMessage: "User ID is required." });
  }

  try {
    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate({ path: "latestMessage", populate: { path: "sender" } });

    if (isChat.length > 0) {
      return res.status(200).json({ success: true, data: isChat[0] });
    } else {
      const newChat = new Chat({
        chatName: "Sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      });

      const savedChat = await newChat.save();
      return res.status(201).json({ success: true, data: savedChat });
    }
  } catch (error) {
    console.error("Error accessing or creating chat:", error);
    return res.status(500).json({ success: false, errorMessage: "Server error: " + error.message });
  }
};

module.exports.fetchChats = async(req,res)=>{
  try {
    const chats = await Chat.find({users : { $elemMatch : {$eq: req.user._id}}}).populate("users").populate("latestMessage").populate("groupAdmin").sort({updatedAt : -1});
    res.status(200).json({chats});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errorMessage: "Server Error: " + error.message });
  }
}

module.exports.createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

module.exports.renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
};

module.exports.addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
};

module.exports.removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
};

