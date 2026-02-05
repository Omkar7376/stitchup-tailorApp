const {customerValidation} = require('../middleware/customerValidation')
const {Customer} = require("../model/customers/customerModel")
const { CustomerOrder } = require('../model/customers/ordersModel')
const { PantMeasur } = require('../model/customers/pantMeasurementModel')
const { ShirtMeasur } = require('../model/customers/shirtMeasurementModel')
const { sequelize } = require("../config/dbConnect");

const createCustomer = async(req, res) => {
    const t = await sequelize.transaction();
    try {
        const {shirtMeasurement, pantMeasurement, order, ...customerData} = req.body

        const {error} = customerValidation.validate(customerData)
        if(error) return res.status(400).json({message : error.details[0].message})

        const maxBookno = await Customer.max('bookno', { transaction: t })
        const nextBookno = (maxBookno || 0) + 1
        customerData.bookno = nextBookno

        const customer = await Customer.create(customerData, { transaction: t })

        const shirtQnuantity = shirtMeasurement?.shirtQnt || 0;
        const pantQnuantity = pantMeasurement?.pantQnt || 0;
        const shirtAmount = shirtMeasurement?.amount || 0;
        const pantAmount = pantMeasurement?.amount || 0;

        const shirtTotal = shirtQnuantity * shirtAmount;
        const pantTotal = pantQnuantity * pantAmount;
        const totalAmount = shirtTotal + pantTotal;
        const discount = order.discount || 0;
        const advance = order.advanceAmount || 0;
        const finalAmount = totalAmount - discount - advance;

        

        const newOrder = await CustomerOrder.create({
            customerId: customer.id,
            orderDate: order.orderDate,
            deliveryDate: order.deliveryDate,
            orderType: order.orderType,
            shirtAmount: shirtAmount,
            pantAmount: pantAmount,  
            totalAmount: totalAmount,
            discount: discount,
            advanceAmount: advance,
            finalPayable: finalAmount,
            status: order.status,
            note: order.note
        },
        { transaction: t })

        let shirt = null;
        let pant = null;

        if(shirtMeasurement) {
            shirt = await ShirtMeasur.create({
                    ...shirtMeasurement,
                    orderId: newOrder.id
                },{ transaction: t }
            )
        }

        if(pantMeasurement) {
            pant = await PantMeasur.create({
                    ...pantMeasurement,
                    orderId: newOrder.id
                },{ transaction: t }
            )
        }

        await t.commit();
        
        return res.status(201).json({
            message: "Customer and Orders created successfully",
            code: 201,
            customer:[{
                CUSTOMERID: customer.id,
                BOOKNO: customer.bookno,
                NAME: customer.name,
                AGE: customer.age,
                GENDER: customer.gender,
                MOB_NO: customer.mob_num,
                ADDRESS: customer.address
            
            }],
            order: [{
                ORDERID: newOrder.id,
                CUSTOMER_ID: newOrder.customerId,
                ORDER_DATE: newOrder.orderDate,
                DELIVERY_DATE: newOrder.deliveryDate,
                ORDER_TYPE: newOrder.orderType,
                SHIRT_AMOUNT: newOrder.shirtAmount,
                PANT_AMOUNT: newOrder.pantAmount,
                TOTAL_AMOUNT: newOrder.totalAmount,
                DISCOUNT: newOrder.discount,
                ADVANCE_AMOUNT: newOrder.advanceAmount,
                FINAL_PAYABLE: newOrder.finalPayable,
                STATUS: newOrder.status,
                NOTE: newOrder.note
            }],
            shirt:[{
                SHIRTID: shirt?.id,
                ORDER_ID: shirt?.orderId,
                SHIRT_QNT: shirt?.shirtQnt,
                CHEST: shirt?.chest,
                LENGTH: shirt?.length,
                SLEEVE: shirt?.sleeve,
                SHOULDER: shirt?.shoulder,
                BACK: shirt?.back,
                BICEP: shirt?.bicep,
                CUFF: shirt?.cuff,
                AMOUNT: shirt?.amount,
                FRONT1: shirt?.front1,
                FRONT2: shirt?.front2,
                FRONT3: shirt?.front3
            }],
            pant:[{
                PANTID: pant?.id,
                ORDER_ID: pant?.orderId,
                PANT_QNT: pant?.pantQnt,
                RISE: pant?.rise,
                WAIST: pant?.waist,
                SEAT: pant?.seat,
                LENGTH: pant?.length,
                THIGH: pant?.thigh,
                BOTTOM: pant?.bottom,
                KNEE: pant?.knee,
                AMOUNT: pant?.amount
            }]
        });   
    } catch (e) {
        await t.rollback();
        console.error(e)
        return res.status(500).json({message : e.message});
    }
}

const getCustomers = async(req, res) => {
    try {
        const customers = await Customer.findAll()
        return res.status(200).json({
            customer: customers.map(c => ({
                ID: c.id,
                BOOKNO: c.bookno,
                NAME: c.name,
                AGE: c.age,
                GENDER: c.gender,
                MOB_NO: c.mob_num,
                ADDRESS: c.address
            }))
        });
    } catch(error) {
        console.error(error)
        return res.status(500).json({message : error.message});
    }
}

const getCustomerById = async(req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id)
        return res.status(200).json({
            customer: [{
                ID: customer.id,
                BOOKNO: customer.bookno,
                NAME: customer.name,
                AGE: customer.age,
                GENDER: customer.gender,
                MOB_NO: customer.mob_num,
                ADDRESS: customer.address
            }]
        })
    } catch(error) {
        console.error(error)
        return res.status(500).json({message : error.message});
    }
}

const updateCustomer = async(req, res) => {
    try {
        const {error} = customerValidation.validate(req.body)
        if(error) return res.status(400).json({message : error.details[0].message})

        const customer = await Customer.findByPk(req.params.id)
        if(!customer) return res.status(500).json({error : "Customer not found"})
        
        await Customer.update(req.body, {
            where: { id: req.params.id}
        })
        res.status(200).json({message : "Customer Updated"})
    } catch (error) {
        console.error(error)
        return res.status(500).json({message : error.message});
    }
}

const deleteCustomer = async(req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id)
        if(!customer) return res.status(500).json({error : "Customer not found"})

        await Customer.destroy()
        return res.status(200).json({message : "Customer Destroid"})  
    }  catch (error) {
        console.error(error)
        return res.status(500).json({error : error.message})
    } 
}  
    
module.exports = {
    createCustomer, getCustomers, getCustomerById, updateCustomer, deleteCustomer
}
