const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'completed', 'cancelled'], default: 'pending' },
  scheduledDate: { type: Date },
  scheduledTime: { type: String },
  completionDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);
