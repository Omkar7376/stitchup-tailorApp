const Joi = require('joi')

const userSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().required(),
    mob_no: Joi.string().required(),
    age: Joi.number().integer().min(0).required(),
    address: Joi.string().required(),
    isActive: Joi.boolean().default(true),
})

module.exports = {userSchema}