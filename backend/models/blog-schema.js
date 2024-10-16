const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  user : {
      type : Schema.Types.ObjectId,
      ref : 'User',
      require : true
  },
  about: {
    type : String,
    require :true
  },
  content : {
    type : String,
    require: true
  },
  title : {
    type : String,
    require : true
  },
  reviews : [{
    type : Schema.Types.ObjectId,
    ref : "Review"
  }]
},{timestamps : true})

const Blog = mongoose.model("Blog",blogSchema);
module.exports = Blog;