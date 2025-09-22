const express = require('express');
const groupController = require('../controllers/groupController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.post('/', authMiddleware, groupController.createGroup);
router.get('/search', groupController.searchGroups);
router.post('/:groupId/join', authMiddleware, groupController.joinGroup);
router.get('/:groupId/members', authMiddleware, groupController.getGroupMembers);

module.exports = router;