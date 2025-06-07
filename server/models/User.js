const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 32,
  },  
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  dailyCalories: Number,
  notRecommendedProducts: [String]
});

module.exports = mongoose.model('User', userSchema);
