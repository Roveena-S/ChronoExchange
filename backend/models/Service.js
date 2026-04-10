const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  creditsRequired: { type: Number, required: true },
  duration: { type: Number, required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  image: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
