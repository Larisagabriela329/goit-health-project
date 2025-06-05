const express = require('express');
const router = express.Router();
const privateController = require('../controllers/privateController');
const authenticate = require('../middlewares/authenticate');

router.post('/daily-rate', authenticate, privateController.saveDailyRate);

module.exports = router;
