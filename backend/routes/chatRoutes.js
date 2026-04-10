const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getMyChats, getMessages, getOrCreateChat, sendMessage } = require('../controllers/chatController');

router.get('/', protect, getMyChats);
router.get('/:chatId/messages', protect, getMessages);
router.get('/request/:requestId', protect, getOrCreateChat);
router.post('/get-or-create', protect, getOrCreateChat);
router.post('/send', protect, sendMessage);
router.post('/:chatId/message', protect, sendMessage);

module.exports = router;
