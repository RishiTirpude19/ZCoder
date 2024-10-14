const Solution = require("../models/solution-model.js");
const {errorHandeler} = require("../utils/error.js");

module.exports = async (req,res,next)=>{ 
    let solution = await Solution.findById(req.params.solutionId);   
    if(!solution.user._id.equals(req.user._id)){
        return next(errorHandeler(404 , "You are not the owner of this Solution"));
    }
    next()
}