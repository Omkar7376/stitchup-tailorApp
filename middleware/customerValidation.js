const Joi = require('joi')

const customerValidation = Joi.object({
    name: Joi.string().required(),
    age: Joi.number().integer().min(0).required(),
    gender: Joi.string().required(),
    mob_num: Joi.string().required(),
    address: Joi.string().required()
})  

module.exports = {customerValidation}