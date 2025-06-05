const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');
const productController = require('../controllers/productController')

router.post('/daily-rate', publicController.calculateCaloriesAndProducts);
router.get('/products', productController.searchProducts);

module.exports = router;
