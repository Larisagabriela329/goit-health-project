const Product = require('../models/Product');
const DailyRate = require('../models/DailyRate');

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
