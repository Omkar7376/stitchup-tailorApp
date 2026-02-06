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

        const shirtQnt = shirtMeasurement?.shirtQnt || 0;
        const pantQnt = pantMeasurement?.PantQnt || 0;
        const shirtUnitPrice = shirtMeasurement?.amount || 0;
        const pantUnitPrice = pantMeasurement?.amount || 0;

        const shirtTotal = shirtQnt * shirtUnitPrice;
        const pantTotal = pantQnt * pantUnitPrice;
        const totalAmount = shirtTotal + pantTotal;
        const discount = order?.discount || 0;
        const advance = order?.advanceAmount || 0;
        const finalAmount = Math.max(0, totalAmount - discount - advance);

        const newOrder = await CustomerOrder.create({
            customerId: customer.id,
            orderDate: order.orderDate,
            deliveryDate: order.deliveryDate,
            orderType: order.orderType,
            shirtAmount: shirtTotal,
            pantAmount: pantTotal,  
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
                FRONT3: shirt?.front3,
                SHIRT_TOTAL: shirtTotal,
                UNIT_PRICE: shirtUnitPrice
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
                AMOUNT: pant?.amount,
                PANT_TOTAL: pantTotal,
                UNIT_PRICE: pantUnitPrice
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
        const customer = await Customer.findByPk(req.params.id, {
            include: [
                {
                    association: "orders",
                    include: [
                        { association: "shirt" },
                        { association: "Pant" }
                    ]
                }
            ]
        })
        if (!customer) {
            return res.status(404).json({ error: "Customer not found" });
        }
        const shirtMeasurements = [];
        const pantMeasurements = [];
        
        if(customer.orders && customer.orders.length > 0) {
            customer.orders.forEach(order => {
                if(order.shirt) {
                    shirtMeasurements.push({
                        SHIRTID: order.shirt.id,
                        ORDER_ID: order.shirt.orderId,
                        SHIRT_QNT: order.shirt.shirtQnt,
                        CHEST: order.shirt.chest,
                        LENGTH: order.shirt.length,
                        SLEEVE: order.shirt.sleeve,
                        SHOULDER: order.shirt.shoulder,
                        BACK: order.shirt.back,
                        BICEP: order.shirt.bicep,
                        CUFF: order.shirt.cuff,
                        COLLAR: order.shirt.collar,
                        AMOUNT: order.shirt.amount,
                        FRONT1: order.shirt.front1,
                        FRONT2: order.shirt.front2,
                        FRONT3: order.shirt.front3
                    });
                }
                if(order.Pant) {
                    pantMeasurements.push({
                        PANTID: order.Pant.id,
                        ORDER_ID: order.Pant.orderId,
                        PANT_QNT: order.Pant.pantQnt,
                        RISE: order.Pant.rise,
                        WAIST: order.Pant.waist,
                        SEAT: order.Pant.seat,
                        LENGTH: order.Pant.length,
                        THIGH: order.Pant.thigh,
                        BOTTOM: order.Pant.bottom,
                        KNEE: order.Pant.knee,
                        OUTSIDE_LENGTH: order.Pant.outsideLength,
                        INSIDE_LENGTH: order.Pant.insideLength,
                        AMOUNT: order.Pant.amount
                    });
                }
            });
        }
        
        return res.status(200).json({
            customer: [{
                ID: customer.id,
                BOOKNO: customer.bookno,
                NAME: customer.name,
                AGE: customer.age,
                GENDER: customer.gender,
                MOB_NO: customer.mob_num,
                ADDRESS: customer.address
            }],
            shirtMeasurements: shirtMeasurements,
            pantMeasurements: pantMeasurements
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