const express = require('express')
const { createShirtMeasur, getShirtMeasument, getShirtMeasumentById, updateShirt, deleteShirt } = require('../controller/shirtController')

const shirtRouter = express.Router()

//shirt
shirtRouter.post('/addShirtMeasurment/:id', createShirtMeasur)
shirtRouter.get('/getShirtMeasurment', getShirtMeasument)
shirtRouter.get('/getShirtMeasurment/:id', getShirtMeasumentById)
shirtRouter.put('/updateShirtMeasurment/:id', updateShirt)
shirtRouter.delete('/deleteShirtMeasurment/:id', deleteShirt)

module.exports = {
    shirtRouter
}