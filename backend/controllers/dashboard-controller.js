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

module.exports.getTopUsers = async(req,res,next)=>{
    try {
    const topUsers = await User.aggregate([
        {
        $project: {
            username: 1,
            email: 1,
            solutionsCount: { $size: { $ifNull: ["$solutions", []] } },
        },
        },
        { $sort: { solutionsCount: -1 } }, 
        { $limit: 5 } 
    ]);

    res.status(200).json(topUsers);
    } catch (error) {
    console.error("Error fetching top users:", error);
    res.status(500).json({ message: "Server error" });
    }
}