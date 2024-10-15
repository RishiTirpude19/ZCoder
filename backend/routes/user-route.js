const express = require("express");
const router = express.Router({mergeParams : true});
const authMiddleware = require("../middlewares/auth-middelware.js");
const UC = require("../controllers/user-controller.js");

router.get("/myproblems" , authMiddleware , UC.myProblems);
router.post("/bookmark/:problemId" ,authMiddleware , UC.addToBookmark);
router.post("/unbookmark/:problemId" , authMiddleware , UC.removeBookmark);
router.get("/bookmarkedproblems" , authMiddleware , UC.getBookmarks);

module.exports = router;