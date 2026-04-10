const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  bio: { type: String, default: '' },
  skillsOffered: [{ type: String }],
  skillsNeeded: [{ type: String }],
  totalCredits: { type: Number, default: 10 },
  creditsEarned: { type: Number, default: 0 },
  creditsSpent: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  completedExchanges: { type: Number, default: 0 },
  isBlocked: { type: Boolean, default: false },
  profilePhoto: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
