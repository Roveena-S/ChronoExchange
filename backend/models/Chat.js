const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: true },
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  unreadCount: { type: Map, of: Number, default: {} }, // userId -> count
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);
