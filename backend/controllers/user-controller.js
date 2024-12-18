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
        const user = await User.findById(req.user._id).populate({path : "otherBookMarkedProblems" , populate : "user"});
        const bookmarkedProblems = user.otherBookMarkedProblems;
        res.json({problems : bookmarkedProblems});
    } catch (error) {
        next(error);
    }
} 

module.exports.addImpLinks = async(req,res,next)=>{
    try {
        const {name , link} = req.body;
        const user = await User.findById(req.user._id)
        user.importantlinks.push({ name, link });
        await user.save();
        res.json({message : "Link added"});
    } catch (error) {
        next(error);
    }
}
module.exports.getImpLinks = async(req,res,next)=>{
    try {
        const user = await User.findById(req.user._id);
        res.json({links : user.importantlinks});
    } catch (error) {
        next(error);
    }
}

module.exports.searchUser = async (req, res) => {
    try {
        const keyword = req.query.search ? {
            $or: [
                { username: { $regex: req.query.search, $options: "i" } },
            ]
        } : {};

        const users = await User.find(keyword).find({_id:{$ne:req.user._id}}); 
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
