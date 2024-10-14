const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const problemSchema = new Schema({
    title : {
        type :String,
        require : true,
    },
    problemstatement : {
        statement : String,
        input : String,
        output : String,
        exampleinput : String,
        exampleoutput : String,
    },
    choice : String,
    platform : {
        name : String,
        rating : Number,
    },
    user : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    solutions : [
        {
            type : Schema.Types.ObjectId,
            ref: "Solution",
        }
    ],
    
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        }
    ],
    link : {
        type : String,
    }
} , {timestamps : true})


const Problem = mongoose.model("Problem" , problemSchema);
module.exports = Problem;