const Joi = require('joi')

const pantMeasurValidation = Joi.object({
    PantQnt : Joi.number().integer().required(),
    amount : Joi.number().required(),
    outsideLength: Joi.number().required(),
    insideLength : Joi.number().required(),
    rise : Joi.number().required(),
    waist : Joi.number().required(),
    seat : Joi.number().required(),
    thigh : Joi.number().required(),
    knee : Joi.number().required(),
    bottom : Joi.number().required()
})

module.exports = {pantMeasurValidation}