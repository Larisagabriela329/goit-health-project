const mongoose = require('mongoose');

const daySchema = new mongoose.Schema({
  date: String,
  user: mongoose.Schema.Types.ObjectId,
  consumedProducts: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      weight: Number,
      kcal: Number
    }
  ]
});

module.exports = mongoose.model('Day', daySchema);
