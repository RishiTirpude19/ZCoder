const Problem = require("../models/probem-model");
const User = require("../models/user-model");
const Solution = require("../models/solution-model");
const Review = require("../models/review-model");

module.exports.addSolution = async(req, res, next)=>{
  try {
    const user = await User.findById(req.user._id);
    const problemId = req.params.problemId;
    const problem = await Problem.findById(problemId);
    const {approach , description , code} = req.body;
    const solution = new Solution({
      approach,
      description,
      code,
      user : user.id,
      problem : problem.id
  });
  await solution.save();
  problem.solutions.push(solution._id);
  problem.save();
  user.solutions.push(solutionId);
  user.save();
  res.status(200).json({message : "Solution Added"});
  } catch (error) {
    next(error);
  }
}

module.exports.destroySolution = async(req,res,next)=>{
  try {
    let userId = req.user._id;
  const solutionId = req.params.solutionId;
  const solution = await Solution.findById(solutionId);
  if (!solution) {
  return res.status(404).json({ message: 'Solution not found' });
  }

  const problemId = solution.problem;
  if (solution.user.toString() !== userId.toString()) {
    return res.status(403).json({ message: 'User not authorized to delete this solution' });
  }
  await User.findByIdAndUpdate(userId, { $pull: { solutions: solutionId } });
  await Problem.findByIdAndUpdate(problemId , {$pull : {solutions : solutionId}});
  await Review.deleteMany({solution : solutionId});
  for(let rev of solution.reviews){
    await Review.findByIdAndDelete(rev._id);
  };
  await Solution.findByIdAndDelete(solutionId);
  res.status(200).json({ message: 'Solution deleted successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports.updateSolution = async(req,res,next)=>{
  try {
    const userId = req.user._id
      const probemId = req.params.probemId;
      const solutionId = req.params.solutionId;
      const solution = await Solution.findById(solutionId);
  if (!solution) {
    return res.status(404).json({ message: 'Solution not found' });
  }
  if (solution.user.toString() !== userId.toString()) {
    return res.status(403).json({ message: 'User not authorized to delete this solution' });
  }
  const {approach , description , code} =  req.body;
  const reviews = solution.reviews;
  const newSolution = await Solution.findByIdAndUpdate(
    solutionId,
    {
      approach,
      description,
      code,
      user : req.user._id,
      problem : probemId,
      reviews : reviews
    },
    { new: true }
  )
  res.status(200).json({message : "Updated Solution" , newSolution});
  } catch (error) {
    next(error)
  }
}

module.exports.showSolution = async(req,res,next)=>{
  try {
    const solutionId = req.params.solutionId;
    const solution = await Solution.findById(solutionId).populate("user").populate("problem");
    res.status(200).json(solution)
  } catch (error) {
    next(error);
  }
}

