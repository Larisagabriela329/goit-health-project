const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  const { search = '' } = req.query;

  const products = await Product.find({
    title: { $regex: search, $options: 'i' }, 
  });

  res.json(products);
});

module.exports = router;
