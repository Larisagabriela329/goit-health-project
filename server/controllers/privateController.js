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
    console.log('Saved DailyRate:', result); 
    res.status(201).json({
      kcal,
      notAllowedProducts: notAllowed,
    });
  } catch (error) {
    console.error(error);
    console.error('Error in saveDailyRate:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.getDay = async (req, res) => {
  console.log('getDay called!');
  try {
    const { date } = req.params;
    const userId = req.user._id;

    const [day, userRate] = await Promise.all([
      Day.findOne({ date, owner: userId }).populate('consumedProducts.product'),
      DailyRate.findOne({ user: userId }),
    ]);

    const notAllowedProducts = userRate?.notAllowedProducts ?? [];
    const dailyRate = userRate?.kcal ?? 0;

    if (!day) {
      return res.json({
        consumedProducts: [],
        daySummary: {
          date,
          kcalLeft: 0,
          kcalConsumed: 0,
          dailyRate,
          percentsOfDailyRate: 0,
        },
        notAllowedProducts,
      });
    }

    const totalKcal = day.consumedProducts.reduce((total, item) => {
      if (!item.product || typeof item.product.calories !== 'number' || typeof item.weight !== 'number') {
        return total;
      }
      return total + (item.weight / 100) * item.product.calories;
    }, 0);

    const kcalLeft = Math.max(dailyRate - totalKcal, 0);
    const percentsOfDailyRate = dailyRate > 0 ? Math.round((totalKcal / dailyRate) * 100) : 0;

    res.json({
      consumedProducts: day.consumedProducts,
      daySummary: {
        date: day.date,
        kcalLeft,
        kcalConsumed: Math.round(totalKcal),
        dailyRate,
        percentsOfDailyRate,
      },
      notAllowedProducts,
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

    console.log(`➡️ addConsumedProduct called for user ${userId}, date: ${date}, productId: ${productId}, weight: ${weight}`);

    let day = await Day.findOne({ date, owner: userId });
    if (!day) {
      day = await Day.create({ date, owner: userId, consumedProducts: [] });
      console.log('🆕 Created new day entry');
    }

    day.consumedProducts.push({ product: productId, weight });
    await day.save();
    console.log('✅ Product added to day and saved');

    // Re-fetch with populated products
    day = await Day.findOne({ date, owner: userId }).populate('consumedProducts.product');
    console.log('🔁 Re-fetched populated day:', JSON.stringify(day.consumedProducts, null, 2));

    const userRate = await DailyRate.findOne({ user: userId });
    const dailyRate = userRate ? userRate.kcal : 0;
    console.log('📊 User daily rate:', dailyRate);

    const totalKcal = day.consumedProducts.reduce((total, item) => {
      console.log('➡️ Calculating for:', item.product?.title, '| calories:', item.product?.calories, '| weight:', item.weight);
      if (!item.product || typeof item.product.calories !== 'number' || typeof item.weight !== 'number') return total;
      return total + (item.weight / 100) * item.product.calories;
    }, 0);

    console.log('🔥 Total kcal consumed:', totalKcal);

    const kcalLeft = dailyRate > 0 ? Math.max(dailyRate - totalKcal, 0) : 0;
    const percentsOfDailyRate = dailyRate > 0 ? Math.round((totalKcal / dailyRate) * 100) : 0;

    res.status(201).json({
      _id: day._id,
      date: day.date,
      consumedProducts: day.consumedProducts,
      daySummary: {
        date: day.date,
        kcalLeft,
        kcalConsumed: Math.round(totalKcal),
        dailyRate,
        percentsOfDailyRate,
      },
      notAllowedProducts: userRate?.notAllowedProducts ?? [], 
    });
    
  } catch (error) {
    console.error("❌ Error adding consumed product:", error);
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
      (item) => item._id.toString() !== productId
    );    
    await day.save();
    await day.populate('consumedProducts.product');


    // Get daily rate from DB
    const userRate = await DailyRate.findOne({ user: userId });
    const dailyRate = userRate ? userRate.kcal : 0;

    // Recalculate total kcal
    const totalKcal = day.consumedProducts.reduce((total, item) => {
      if (!item.product || typeof item.product.calories !== 'number' || typeof item.weight !== 'number') return total;
      return total + (item.weight / 100) * item.product.calories;
    }, 0);

    const kcalLeft = dailyRate > 0 ? Math.max(dailyRate - totalKcal, 0) : 0;
    const percentsOfDailyRate = dailyRate > 0 ? Math.round((totalKcal / dailyRate) * 100) : 0;

    res.json({
      consumedProducts: day.consumedProducts,
      daySummary: {
        date: day.date,
        kcalLeft,
        kcalConsumed: Math.round(totalKcal),
        dailyRate,
        percentsOfDailyRate,
      },
      notAllowedProducts: userRate?.notAllowedProducts ?? [], 
    });
    
  } catch (error) {
    console.error("Error removing consumed product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
