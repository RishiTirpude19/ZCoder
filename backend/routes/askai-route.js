const express = require("express");
const AI = require("../controllers/askai-controller.js");
const router = express.Router({mergeParams : true});
const authMiddleware = require("../middlewares/auth-middelware.js");

router.post("/" , AI.main);


module.exports = router;