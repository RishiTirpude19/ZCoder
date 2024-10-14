const express = require("express");
const DC = require("../controllers/dashboard-controller.js");
const router = express.Router({mergeParams : true});
const authMiddleware = require("../middlewares/auth-middelware.js");

router.get("/dashboard" ,authMiddleware, DC.showPoroblems);

module.exports = router;

