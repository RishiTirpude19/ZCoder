const Blog = require("../models/blog-schema.js");
const Review = require("../models/review-model.js");
const Solution = require("../models/solution-model.js");

module.exports.addReview = async(req,res,next)=>{
  try {
    const blogId = req.params.blogId;
    const blog = await Blog.findById(blogId);

    const { rating, comment } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment are required.' });
    }
    const newReview = new Review({
      rating,
      comment,
      user: req.user._id,
      blog: blogId,
    });

    await newReview.save();
    blog.reviews.push(newReview._id);
    await blog.save();
    const populatedReview = await Review.findById(newReview._id)
      .populate('user') 
      .populate('blog');
    res.status(201).json({ message: 'Review added successfully!', review: populatedReview });
  } catch (error) {
    next(error);
  }
}

module.exports.showReviews = async(req,res,next)=>{
  try {
    const blogId = req.params.blogId;
    const blog = await Blog.findById(blogId).populate({
    path: 'reviews',
    populate: {
    path: 'user', 
    select: 'username' 
    }
  });
  res.status(201).json(blog);
  } catch (error) {
    next(error);
  }
}

module.exports.destroyReview = async (req,res,next)=>{
  try {
    const reviewId = req.params.reviewId;
    const blogId = req.params.blogId;
    const blog = await Blog.findByIdAndUpdate(blogId , { $pull: {reviews : reviewId}});
    await blog.save();
    await Review.findByIdAndDelete(reviewId);
    res.status(200).json({message : "Review Deleted"});
  } catch (error) {
    next(error);
  }
}