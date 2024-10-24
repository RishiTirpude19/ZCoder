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
    gitHub : {
        type : String,
    },
    projectslinks : 
    [
        {
            type : String,
        }
    ],
    skills : [{
        type : String
    }],
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
    blogs: [
        {
        type : Schema.Types.ObjectId,
        ref : "Blog"
        }
    ],
    collaborator : {
        type : Boolean,
        default : false,
    },
    importantlinks: [
    {
        name: { type: String, required: true },  // Each field has its own type definition
        link: { type: String, required: true }
    }
],

}, {timestamps : true})

const User = mongoose.model("User" , userSchema);
module.exports = User;