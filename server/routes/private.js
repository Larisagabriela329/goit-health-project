const express = require('express');
const router = express.Router();
const privateController = require('../controllers/privateController');
const authenticate = require('../middlewares/authenticate');


router.post('/daily-rate', authenticate, privateController.saveDailyRate);


router.get('/day/:date', authenticate, privateController.getDay);
router.post('/day/:date/consumed', authenticate, privateController.addConsumedProduct);
router.delete('/day/:date/consumed/:productId', authenticate, privateController.removeConsumedProduct);

module.exports = router;
 