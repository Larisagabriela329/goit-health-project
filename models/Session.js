const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  refreshToken: { type: String, required: true },
  expiresAt: { type: Date, required: true }
});

module.exports = mongoose.model('Session', sessionSchema);
