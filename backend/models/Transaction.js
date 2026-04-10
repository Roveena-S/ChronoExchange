const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  credits: { type: Number, required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: true },
  transactionType: { type: String, enum: ['earned', 'spent'], required: true },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
