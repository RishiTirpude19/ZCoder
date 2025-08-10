const express = require("express");
const AC = require("../controllers/auth-controller.js");
const router = express.Router({mergeParams : true});
const authMiddleware = require("../middlewares/auth-middelware.js");

router.post("/signup" , AC.signup);
router.post("/signin" , AC.signin);
router.post("/logout" , authMiddleware , AC.logout);
router.get("/check-auth" , authMiddleware , AC.checkAuth);

module.exports = router;