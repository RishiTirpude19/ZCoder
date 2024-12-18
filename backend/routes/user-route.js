const express = require("express");
const router = express.Router({mergeParams : true});
const authMiddleware = require("../middlewares/auth-middelware.js");
const UC = require("../controllers/user-controller.js");

router.get("/myproblems" , authMiddleware , UC.myProblems);
router.post("/bookmark/:problemId" ,authMiddleware , UC.addToBookmark);
router.post("/unbookmark/:problemId" , authMiddleware , UC.removeBookmark);
router.post("/implinks" , authMiddleware , UC.addImpLinks);
router.get("/bookmarkedproblems" , authMiddleware , UC.getBookmarks);
router.get("/implinks" , authMiddleware , UC.getImpLinks);
router.get("/searchuser" , authMiddleware , UC.searchUser);

module.exports = router;