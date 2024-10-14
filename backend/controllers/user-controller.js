const Problem = require("../models/probem-model");
const User = require("../models/user-model");

module.exports.myProblems = async(req, res, next)=>{
    try {
        const user = await User.findById(req.user._id).populate("problems");
        res.status(200).json({problems : user.problems , username : user.username});
    } catch (error) {
        next(error);
    }
}

module.exports.addToBookmark = async(req,res,next)=>{
    try {
        const id = req.params.problemId;
        const problem = await Problem.findById(id);
        const user = await User.findById(req.user._id);
        user.otherBookMarkedProblems.push(problem);
        await user.save();
        res.status(200).json("added to bookmark")
    } catch (error) {
        next(error);
    }
}

module.exports.removeBookmark = async (req, res, next) => {
    try {
        const problemId = req.params.problemId;
        const userId = req.user._id;

        const result = await User.updateOne(
            { _id: userId },
            { $pull: { otherBookMarkedProblems: problemId } }
        );
        if (result.modifiedCount > 0) {
            res.status(200).json("Removed from bookmark");
        } else {
            res.status(404).json("Problem not found in bookmarks");
        }
    } catch (error) {
        next(error);
    }
};

module.exports.getBookmarks = async(req,res,next)=>{
    try {
        const user = await User.findById(req.user._id).populate("otherBookMarkedProblems");
        const bookmarkedProblems = user.otherBookMarkedProblems;
        res.json({problems : bookmarkedProblems});
    } catch (error) {
        next(error);
    }
}