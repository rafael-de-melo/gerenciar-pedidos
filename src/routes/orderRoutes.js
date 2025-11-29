const express = require('express');
const router = express.Router();
const { createOrderHandler, getOrderHandler } = require('../controllers/orderController');

router.post('/order', createOrderHandler);
router.get('/order/:orderId', getOrderHandler);

module.exports = router;