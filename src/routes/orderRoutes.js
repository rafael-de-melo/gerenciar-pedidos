const express = require('express');
const router = express.Router();
const { createOrderHandler, getOrderHandler, getAllOrdersHandler, deleteOrderHandler, updateOrderHandler } = require('../controllers/orderController');

router.post('/order', createOrderHandler);
router.get('/order/:orderId', getOrderHandler);
router.get('/orders', getAllOrdersHandler);
router.delete('/order/:orderId', deleteOrderHandler);
router.put('/order/:orderId', updateOrderHandler)

module.exports = router;