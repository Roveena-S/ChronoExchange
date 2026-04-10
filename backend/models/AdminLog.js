const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('AdminLog', adminLogSchema);
