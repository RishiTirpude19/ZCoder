const express = require("express");
const router = express.Router();
const authMiddelware = require("../middlewares/auth-middelware")
const MC = require("../controllers/message-controller");

router.post("/" , authMiddelware , MC.sendMessage);
router.get("/:chatId" , authMiddelware , MC.allMessages);

module.exports = router;