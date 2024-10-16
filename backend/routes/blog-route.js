const express = require("express");
const BC = require("../controllers/blog-controller.js");
const BRC = require("../controllers/blog-reviews-controller.js")
const router = express.Router({mergeParams : true});
const isReviewOwner = require("../middlewares/isReviewOwner.js");
const authMiddleware = require("../middlewares/auth-middelware.js");

router.get("/" ,authMiddleware, BC.getBlogs);
router.post("/addblog" ,authMiddleware , BC.addBlog);
router.get("/:blogId" , authMiddleware , BC.getBlog);
router.delete("/:blogId" , authMiddleware , BC.deleteBlog);
router.get("/:blogId/reviews" , authMiddleware , BRC.showReviews);
router.post("/:blogId/addreviews" , authMiddleware , BRC.addReview);
router.delete("/:blogId/reviews/:reviewId" , authMiddleware, isReviewOwner , BRC.destroyReview);

module.exports = router;