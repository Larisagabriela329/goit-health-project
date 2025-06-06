const express = require('express');
const router = express.Router();
const Day = require('../models/Day')
const authenticate = require('../middlewares/authenticate');


router.get('/:date', authenticate, async (req, res) => {
    try {
      const { date } = req.params;
      const userId = req.user._id;
  
      const day = await Day.findOne({ date, owner: userId }).populate('consumedProducts.product');
      if (!day) return res.json({ consumedProducts: [], totalKcal: 0 });
  
      const totalKcal = day.consumedProducts.reduce((total, item) => {
        if (!item.product || typeof item.product.kcal !== 'number' || typeof item.weight !== 'number') return total;
        return total + (item.weight / 100) * item.product.kcal;
      }, 0);
      
  
      res.json({
        consumedProducts: day.consumedProducts,
        totalKcal,
      });
    } catch (error) {
      console.error("Error fetching day data:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  router.post('/:date/consumed', authenticate, async (req, res) => {
    try {
      const { date } = req.params;
      const { productId, weight } = req.body;
      const userId = req.user._id;
  
      let day = await Day.findOne({ date, owner: userId });
      if (!day) {
        day = await Day.create({ date, owner: userId, consumedProducts: [] });
      }
  
      day.consumedProducts.push({ product: productId, weight });
      await day.save();
  
      res.status(201).json(day);
    } catch (error) {
      console.error("Error adding consumed product:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  router.delete('/:date/consumed/:productId', authenticate, async (req, res) => {
    try {
      const { date, productId } = req.params;
      const userId = req.user._id;
  
      const day = await Day.findOne({ date, owner: userId });
      if (!day) return res.status(404).json({ message: 'Day not found' });
  
      day.consumedProducts = day.consumedProducts.filter(
        (item) => item.product.toString() !== productId
      );
      await day.save();
  
      res.json({ message: 'Product removed' });
    } catch (error) {
      console.error("Error removing consumed product:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  module.exports = router;  