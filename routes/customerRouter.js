const express = require('express')
const { createCustomer, getCustomers, getCustomerById, updateCustomer, deleteCustomer } = require('../controller/customerController')

const customerRouter = express.Router()

//Customer
customerRouter.post('/addCustomer', createCustomer)
customerRouter.get('/getCustomers', getCustomers)
customerRouter.get('/getCustomer/:id', getCustomerById)
customerRouter.put('/updatecustomer/:id', updateCustomer)
customerRouter.delete('/deletecustomer/:id', deleteCustomer)

module.exports = {
    customerRouter
}