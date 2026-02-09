const Joi = require('joi')

const customerValidation = Joi.object({
    name: Joi.string().required(),
    gender: Joi.string().required(),
    mob_num: Joi.string().required(),
    address: Joi.string().required()
})  

module.exports = {customerValidation}