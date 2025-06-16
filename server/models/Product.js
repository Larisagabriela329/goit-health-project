const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    category: String,
    weight: Number,
    title: String,
    calories: Number,
  groupBloodNotAllowed: {
    1: Boolean,
    2: Boolean,
    3: Boolean,
    4: Boolean
  }
});

module.exports = mongoose.model('Product', productSchema);
