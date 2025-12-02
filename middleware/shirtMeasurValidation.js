const Joi = require('joi')

const shirtMeasurValidation = Joi.object({
    shirtQnt : Joi.number().integer().required(),
    amount : Joi.number().required(),
    length: Joi.number().required(),
    chest : Joi.number().required(),
    shoulder : Joi.number().required(),
    sleeve : Joi.number().required(),
    collar : Joi.number().required(),
    front1 : Joi.number().required(),
    front2 : Joi.number().required(),
    front3 : Joi.number().required()
})

module.exports = {shirtMeasurValidation}