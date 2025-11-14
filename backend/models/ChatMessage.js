const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
    roomId: { type: String, index: true, required: true },
    text: { type: String, required: true },
    user: {
        uid: { type: String },
        name: { type: String },
        email: { type: String },
    },
    ts: { type: Number },
}, { timestamps: true });

ChatMessageSchema.index({ roomId: 1, createdAt: -1 });

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
