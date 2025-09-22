const express = require('express');
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.post('/:groupId/messages', authMiddleware, messageController.sendMessage);
router.get('/:groupId/messages', authMiddleware, messageController.getMessages);

module.exports = router;