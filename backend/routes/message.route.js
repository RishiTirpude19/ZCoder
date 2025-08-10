const express = require('express');
const router = express.Router();
const { getUsers ,getMessages, sendMessage } = require('../controllers/message.controller');
const authMiddleware = require('../middlewares/auth-middelware.js');

router.get('/users', authMiddleware, getUsers);
router.get('/:id' , authMiddleware, getMessages);
router.post('/send/:id', authMiddleware, sendMessage);

module.exports = router;