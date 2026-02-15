const express = require('express');
const { createOrder } = require('../controller/orderController');

const orderRouter = express.Router();

orderRouter.post('/createOrder/:id', createOrder)

module.exports = {
    orderRouter
}