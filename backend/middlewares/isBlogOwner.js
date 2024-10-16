const Blog = require("../models/blog-schema.js");
const {errorHandeler} = require("../utils/error.js")

module.exports = async (req,res,next)=>{
    let id = req.params.blogId;
    let blog = await Blog.findById(id);
    if(!blog.user._id.equals(req.user._id)){
        return next(errorHandeler(404 , "You are not the Owner of this problem"))
    }
    next()
}