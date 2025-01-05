const Chat = require("../models/chat-schema");
const Message = require("../models/message-model");

module.exports.sendMessage =  async (req,res)=>{
  const {chatId , content} = req.body;
  if(!chatId || !content){
    console.log("No valid chat or content");
    return res.status(400).json({message : "Error in content or chatId"});
  }
  try {
    const newMessage = new Message({
    sender:req.user._id,
    content,
    chat : chatId
  });
    const newMess = await newMessage.save();
    const chat = await Chat.findByIdAndUpdate(chatId , {
      latestMessage : newMess,
    });
    chat.messages.push(newMess);
    await chat.save();
    const newChat = await Chat.findById(chatId);
    
    res.status(200).json({message : "Message sent successfully" , newMessage : newMess , updatedChat : newChat});
  } catch (error) {
    console.log(error);
    res.status(400).json({message : "Error in try-cath block"})
  }
}

module.exports.allMessages = async(req,res)=>{
  const chatId = req.params.chatId;
  if(!chatId){
    console.log("No valid Chat ID in params");
    res.status(400).json({message : "No Chat id provided in aprams"});
  }
  try {
    const chat = await Chat.findById(chatId).populate("users").populate("latestMessage").populate("messages");
    res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    res.status(400).json({message : "Error occured in fetching all messages"});
  }
}