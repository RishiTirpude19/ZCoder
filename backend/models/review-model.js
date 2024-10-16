const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const reviewSchema = new Schema({
    rating : {
        type : Number,
        min : 1,
        max : 5,
        default : 1,
    },
    comment : {
        type : String
    },
    user : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    problem : {
        type : Schema.Types.ObjectId,
        ref : "Problem",
    },
    solution : {
        type : Schema.Types.ObjectId,
        ref : "Solution",
    },
    blog : {
        type : Schema.Types.ObjectId,
        ref : "Blog",
    }
}, {timestamps : true});

const Review = mongoose.model("Review",reviewSchema);
module.exports = Review;