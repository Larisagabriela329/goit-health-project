const Product = require('../models/Product');

const calculateCalories = ({ currentWeight, height, age, desiredWeight }) => {
  return Math.round(10 * currentWeight + 6.25 * height - 5 * age - 161 - (currentWeight - desiredWeight) * 10);
};

exports.calculateCaloriesAndProducts = async (req, res) => {
  const { currentWeight, height, age, desiredWeight, bloodType } = req.body;

  if (![1, 2, 3, 4].includes(bloodType)) {
    return res.status(400).json({ message: 'Invalid blood type' });
  }

  const dailyCalories = calculateCalories({ currentWeight, height, age, desiredWeight });

  const allProducts = await Product.find();
  const notAllowedProducts = allProducts.filter(p => p.groupBloodNotAllowed?.[bloodType]);

  const simplifiedProducts = notAllowedProducts.map(p => ({
    title: p.title,
    category: p.category,
    kcal: p.kcal
  }));

  res.json({ dailyCalories, notAllowedProducts: simplifiedProducts });
};
