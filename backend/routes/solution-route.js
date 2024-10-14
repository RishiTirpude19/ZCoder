const express = require("express");
const SC = require("../controllers/solution-controller.js");
const router = express.Router({mergeParams : true});
const authMiddleware = require("../middlewares/auth-middelware.js");
const isSolutionOwner = require("../middlewares/isSolutionOwner.js");
const SRC = require("../controllers/solution-review-controller.js");

router.post("/addsolution" ,authMiddleware , SC.addSolution);
router.get("/solutions/:solutionId" , authMiddleware , SC.showSolution);
router.post("/solutions/:solutionId/addreview" , authMiddleware , SRC.addReview);
router.get("/solutions/:solutionId/reviews" , authMiddleware , SRC.showReviews);
router.put("/solutions/:solutionId/updatesolution" , authMiddleware , isSolutionOwner , SC.updateSolution);
router.delete("/solutions/:solutionId/deletesolution" , authMiddleware , isSolutionOwner , SC.destroySolution);

module.exports = router;