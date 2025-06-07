const Product = require('../models/Product');
const DailyRate = require('../models/DailyRate');
const Day = require('../models/Day');

const calculateCalories = ({ currentWeight, height, age, desiredWeight }) => {
  return Math.round(
    10 * currentWeight + 6.25 * height - 5 * age - 161 - (currentWeight - desiredWeight) * 10
  );
};

exports.saveDailyRate = async (req, res) => {
  try {
    const { currentWeight, height, age, desiredWeight, bloodType } = req.body;

    const kcal = calculateCalories({ currentWeight, height, age, desiredWeight });

    const allProducts = await Product.find();
    const notAllowed = allProducts
      .filter(p => p.groupBloodNotAllowed[bloodType])
      .map(p => p.title);

    const result = await DailyRate.create({
      user: req.user._id,
      kcal,
      notAllowedProducts: notAllowed,
    });

    res.status(201).json({
      kcal,
      notAllowedProducts: notAllowed,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.getDay = async (req, res) => {
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
};


exports.addConsumedProduct = async (req, res) => {
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
};


exports.removeConsumedProduct = async (req, res) => {
  try {
    const { date, productId } = req.params;
    const userId = req.user._id;

    const day = await Day.findOne({ date, owner: userId }).populate('consumedProducts.product');
    if (!day) return res.status(404).json({ message: 'Day not found' });

    day.consumedProducts = day.consumedProducts.filter(
      (item) => item.product._id.toString() !== productId
    );
    await day.save();

    // Recalculate total kcal
    const totalKcal = day.consumedProducts.reduce((total, item) => {
      if (!item.product || typeof item.product.kcal !== 'number' || typeof item.weight !== 'number') return total;
      return total + (item.weight / 100) * item.product.kcal;
    }, 0);

    res.json({
      consumedProducts: day.consumedProducts,
      daySummary: {
        date: day.date,
        kcalLeft: 0, // You can adjust this if needed
        kcalConsumed: totalKcal,
        dailyRate: 0, // Or load this from your DailyRate model
        percentsOfDailyRate: 0, // same here
      }
    });
  } catch (error) {
    console.error("Error removing consumed product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
