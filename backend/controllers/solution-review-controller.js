const Review = require("../models/review-model.js");
const Solution = require("../models/solution-model.js");

module.exports.addReview = async(req,res,next)=>{
  try {
    const solutionId = req.params.solutionId;
    const solution = await Solution.findById(solutionId);

    const { rating, comment } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment are required.' });
    }
    const newReview = new Review({
      rating,
      comment,
      user: req.user._id,
      solution: solutionId,
    });

    await newReview.save();
    solution.reviews.push(newReview._id);
    await solution.save();
    const populatedReview = await Review.findById(newReview._id)
      .populate('user') 
      .populate('solution');
    res.status(201).json({ message: 'Review added successfully!', review: populatedReview });
  } catch (error) {
    next(error);
  }
}

module.exports.showReviews = async(req,res,next)=>{
  try {
    const solutionId = req.params.solutionId;
    const solution = await Solution.findById(solutionId).populate({
    path: 'reviews',
    populate: {
    path: 'user', 
    select: 'username' 
    }
  });
  res.status(201).json(solution);
  } catch (error) {
    next(error);
  }
}