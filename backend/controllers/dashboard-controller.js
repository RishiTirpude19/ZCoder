const Problem = require("../models/probem-model");
const User = require("../models/user-model");

module.exports.showPoroblems = async(req,res,next)=>{
    try {
        const problems = await Problem.find().populate("user").sort({ createdAt: -1 });
        res.status(200).json(problems);
    } catch (error) {
        next(error);
    }
}

module.exports.showUsers = async(req,res,next)=>{
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}