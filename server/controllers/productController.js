const Product = require('../models/Product');

exports.searchProducts = async (req, res) => {
  try {
    const search = req.query.search || '';
    const regex = new RegExp(search, 'i'); 

    const products = await Product.find({ title: regex });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to search products' });
  }
};