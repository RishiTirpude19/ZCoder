const Problem = require("../models/probem-model.js");
const Review = require("../models/review-model.js");

module.exports.addReview = async(req,res,next)=>{
  try {
    const problemId = req.params.problemId;
    const problem = await Problem.findById(problemId);
    const { rating, comment } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment are required.' });
    }
    const newReview = new Review({
      rating,
      comment,
      user: req.user._id,
      problem: problemId,
    });

    await newReview.save();
    problem.reviews.push(newReview._id);
    await problem.save();
    const populatedReview = await Review.findById(newReview._id)
      .populate('user') 
      .populate('problem'); 
    res.status(201).json({ message: 'Review added successfully!', review: populatedReview });
  } catch (error) {
    next(error);
  }
}

module.exports.showReviews = async(req,res,next)=>{
  try {
    const problemId = req.params.problemId;
    const problem = await Problem.findById(problemId).populate({
    path: 'reviews',
    populate: {
    path: 'user', 
    select: 'username' 
    }
  });
  res.status(201).json(problem);
  } catch (error) {
    next(error);
  }
}

module.exports.destroyReview = async (req,res,next)=>{
  try {
    const reviewId = req.params.reviewId;
    const probId = req.params.problemId;
    const probem = await Problem.findByIdAndUpdate(probId , { $pull: {reviews : reviewId}});
    await probem.save();
    await Review.findByIdAndDelete(reviewId);
    res.status(200).json({message : "Review Deleted"});
  } catch (error) {
    next(error);
  }
}