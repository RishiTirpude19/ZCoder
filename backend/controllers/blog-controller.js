const Blog = require("../models/blog-schema.js");
const User = require("../models/user-model.js");
const Review = require("../models/review-model.js");


module.exports.addBlog = async(req,res,next)=>{
  try {
    const user = await User.findById(req.user._id);
    const  {title , about , content} = req.body;
  const newBlog = new Blog({
    title,
    content,
    about,
    user : req.user._id
  })
  await newBlog.save();
  user.blogs.push(newBlog);
  await user.save();
  res.status(200).json({message : "Blog added"})
  } catch (error) {
    next(error)
  }
}

module.exports.getBlogs = async(req,res,next)=>{
  try {
    const allBlogs = await Blog.find();
    res.json({blogs : allBlogs})
  } catch (error) {
    next(error);
  }
}

module.exports.getBlog = async(req,res,next)=>{
  try {
    const blog = await Blog.findById(req.params.blogId).populate("user").populate("reviews");
    res.json({blog : blog})
  } catch (error) {
    next(error)
  }
}

module.exports.deleteBlog = async (req, res, next) => {
  try {
    
    const blog = await Blog.findById(req.params.blogId);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    
    await Review.deleteMany({ _id: { $in: blog.reviews } });

    
    await Blog.findByIdAndDelete(req.params.blogId);

    
    res.status(200).json({ message: 'Blog and associated reviews deleted successfully' });

  } catch (error) {
    
    next(error);
  }
};
