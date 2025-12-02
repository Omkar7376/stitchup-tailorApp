const express = require('express')
const { createPantMeasur, getPantMeasurment, getPantMeasumentById, updatePantMeasurment, deletePantMeasurment } = require('../controller/pantController')

const pantRouter = express.Router()

//pant
pantRouter.post('/addPantMeasurment/:id', createPantMeasur)
pantRouter.get('/getPantMeasurment', getPantMeasurment)
pantRouter.get('/getPantMeasurment/:id', getPantMeasumentById)
pantRouter.put('/updatePantMeasurment/:id', updatePantMeasurment)
pantRouter.delete('/deletePantMeasurment/:id', deletePantMeasurment)

module.exports = {
    pantRouter
}