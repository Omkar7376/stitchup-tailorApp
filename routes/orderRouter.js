const express = require('express');
const { createOrder, getOrders } = require('../controller/orderController');

const orderRouter = express.Router();

orderRouter.post('/createOrder/:id', createOrder)
orderRouter.get('/getOrders', getOrders)

module.exports = {
    orderRouter, 
}