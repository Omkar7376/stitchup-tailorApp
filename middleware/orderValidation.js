const Joi = require('joi')

const orderValidation = Joi.object({
    orderDate : Joi.date().required(),
    deliveryDate : Joi.date().required(),
    orderType : Joi.string().required(),
    shirtAmount: Joi.number().optional(),
    pantAmount: Joi.number().optional(),
    totalAmount: Joi.number().optional(),
    discount: Joi.number().optional(),
    advanceAmount : Joi.number().optional(),
    finalPayable : Joi.number().optional(),
    status : Joi.string().optional(),
    note : Joi.string().optional()
})

module.exports = {orderValidation}