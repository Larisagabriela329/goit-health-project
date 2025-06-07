const mongoose = require('mongoose');

const dailyRateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  kcal: Number,
  notAllowedProducts: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DailyRate', dailyRateSchema);
