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
            
        const customer = await Customer.create(customerData, {transaction: t})

        const shirtAmount = shirtMeasurement?.amount || 0;
        const pantAmount = pantMeasurement?.amount || 0;

        const totalAmount = shirtAmount + pantAmount;
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
            customer,
            order: newOrder,
            shirt,
            pant
        });   
    } catch (e) {
        await t.rollback();
        console.error(error)
        return res.status(500).json({message : error.message});
    }
}

const getCustomers = async(req, res) => {
    try {
        const customers = await Customer.findAll()
        return res.status(200).json(customers.map(c => ({
            ID: c.id,
            NAME: c.name,
            AGE: c.age,
            GENDER: c.gender,
            MOB_NO: c.mob_num,
            ADDRESS: c.address
          }))
        );
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
