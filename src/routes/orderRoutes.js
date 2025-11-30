const express = require('express');
const router = express.Router();
const { createOrderHandler, getOrderHandler, getAllOrdersHandler } = require('../controllers/orderController');

router.post('/order', createOrderHandler);
router.get('/order/:orderId', getOrderHandler);
router.get('/orders', getAllOrdersHandler);

module.exports = router;