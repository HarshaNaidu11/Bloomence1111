const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage');

// GET chat history for a room
router.get('/:roomId/messages', async (req, res) => {
    try {
        const { roomId } = req.params;
        const limit = Math.min(parseInt(req.query.limit || '100', 10), 500);
        const msgs = await ChatMessage.find({ roomId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();
        res.json({ messages: msgs.reverse() });
    } catch (e) {
        console.error('chat history error', e);
        res.status(500).json({ message: 'failed to load chat history' });
    }
});

module.exports = router;
