const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new mongoose.Schema({
    problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message" , messageSchema);
module.exports = Message;