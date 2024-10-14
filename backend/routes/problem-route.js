const express = require("express");
const PC = require("../controllers/problem-controller.js");
const PRC = require("../controllers/problem-review-controller.js");
const router = express.Router({mergeParams : true});
const authMiddleware = require("../middlewares/auth-middelware.js");
const isProblemOwner = require("../middlewares/isProblemOwner.js");

router.post("/addproblem" , authMiddleware, PC.addProblem);
router.get("/problem/:problemId" , authMiddleware , PC.showProblem);
router.get("/problem/:problemId/solutions" , authMiddleware , PC.showSolutions);
router.post("/problem/:problemId/addreview" , authMiddleware , PRC.addReview);
router.get("/problem/:problemId/reviews" , authMiddleware , PRC.showReviews);
router.put("/problem/:problemId/updateproblem" , authMiddleware , isProblemOwner , PC.updateProblem);
router.delete("/problem/:problemId/deleteproblem" , authMiddleware , isProblemOwner , PC.destroyProblem);

module.exports = router;