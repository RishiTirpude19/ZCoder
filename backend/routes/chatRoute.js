const express = require("express");
const router = express.Router({mergeParams : true});
const authMiddleware = require("../middlewares/auth-middelware.js");
const CC  = require("../controllers/chatControlletr.js");

router.get("/", authMiddleware , CC.fetchChats);
router.post("/", authMiddleware , CC.accessChat);
router.post("/group", authMiddleware , CC.createGroupChat);
router.put("/rename", authMiddleware , CC.renameGroup);
router.put("/groupremove", authMiddleware , CC.removeFromGroup);
router.put("/groupadd", authMiddleware , CC.addToGroup);

module.exports = router