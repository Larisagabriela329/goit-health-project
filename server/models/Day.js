const { Schema, model } = require('mongoose');

const consumedProductSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
  },
  weight: Number,
});

const daySchema = new Schema({
  date: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  consumedProducts: [consumedProductSchema],
});

module.exports = model('Day', daySchema);
