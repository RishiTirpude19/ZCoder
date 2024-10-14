const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username : {
        type: String,
        unique : true,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true
    },
    favlanguage : {
        type : String,
    },
    rating : {
        type : Number,
    },
    platform : {
        type : String,
    },
    problems : [{
        type : Schema.Types.ObjectId,
        ref : "Problem"
    }],
    solutions : [
        {
        type : Schema.Types.ObjectId,
        ref : "Solution"
        }
    ],
    otherBookMarkedProblems : [ 
        {
        type : Schema.Types.ObjectId,
        ref : "Problem"
        }
    ],
}, {timestamps : true})

const User = mongoose.model("User" , userSchema);
module.exports = User;