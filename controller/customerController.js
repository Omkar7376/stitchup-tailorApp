const { customerValidation } = require('../middleware/customerValidation')
const { Customer } = require("../model/customers/customerModel")
const { CustomerOrder } = require('../model/customers/ordersModel')
const { PantMeasur } = require('../model/customers/pantMeasurementModel')
const { ShirtMeasur } = require('../model/customers/shirtMeasurementModel')
const { sequelize } = require("../config/dbConnect");

const createCustomer = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { shirtMeasurement, pantMeasurement, order, ...customerData } = req.body

        const { error } = customerValidation.validate(customerData)
        if (error) return res.status(400).json({ message: error.details[0].message })

        const maxBookno = await Customer.max('bookno', { transaction: t })
        const nextBookno = (maxBookno || 0) + 1
        customerData.bookno = nextBookno

        const customer = await Customer.create(customerData, { transaction: t })

        const shirtQnt = order?.shirtQnt || 0;
        const pantQnt = order?.pantQnt || 0;
        const shirtUnitPrice = order?.shirtAmount || 0;
        const pantUnitPrice = order?.pantAmount || 0;

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
            shirtQnt: shirtQnt,
            pantQnt: pantQnt,
            shirtAmount: shirtUnitPrice,
            pantAmount: pantUnitPrice,
            shirtTotal: shirtTotal,
            pantTotal: pantTotal,
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

        if (shirtMeasurement) {
            shirt = await ShirtMeasur.create({
                ...shirtMeasurement,
                orderId: newOrder.id
            }, { transaction: t }
            )
        }

        if (pantMeasurement) {
            pant = await PantMeasur.create({
                ...pantMeasurement,
                orderId: newOrder.id
            }, { transaction: t }
            )
        }

        await t.commit();

        return res.status(201).json({
            message: "Customer and Orders created successfully",
            code: 201,
            customer: [{
                CUSTOMERID: customer.id,
                BOOKNO: customer.bookno,
                NAME: customer.name,
                GENDER: customer.gender,
                MOB_NO: customer.mob_num,
                ADDRESS: customer.address,
                CREATED_AT: customer.createdAt,
                UPDATED_AT: customer.updatedAt
            }],
            order: [{
                ORDERID: newOrder.id,
                CUSTOMER_ID: newOrder.customerId,
                ORDER_DATE: newOrder.orderDate,
                DELIVERY_DATE: newOrder.deliveryDate,
                ORDER_TYPE: newOrder.orderType,
                SHIRT_QNT: newOrder.shirtQnt,
                PANT_QNT: newOrder.pantQnt,
                SHIRT_AMOUNT: shirtUnitPrice,
                PANT_AMOUNT: pantUnitPrice,
                SHIRT_TOTAL: shirtTotal,
                PANT_TOTAL: pantTotal,
                TOTAL_AMOUNT: newOrder.totalAmount,
                DISCOUNT: newOrder.discount,
                ADVANCE_AMOUNT: newOrder.advanceAmount,
                FINAL_PAYABLE: newOrder.finalPayable,
                STATUS: newOrder.status,
                NOTE: newOrder.note
            }],
            shirt: [{
                SHIRTID: shirt?.id,
                ORDER_ID: shirt?.orderId,
                CHEST: shirt?.chest,
                LENGTH: shirt?.length,
                SLEEVE: shirt?.sleeve,
                SHOULDER: shirt?.shoulder,
                BACK: shirt?.back,
                BICEP: shirt?.bicep,
                CUFF: shirt?.cuff,
                FRONT1: shirt?.front1,
                FRONT2: shirt?.front2,
                FRONT3: shirt?.front3,
                CREATED_AT: shirt?.createdAt,
                UPDATED_AT: shirt?.updatedAt
            }],
            pant: [{
                PANTID: pant?.id,
                ORDER_ID: pant?.orderId,
                OUTSIDE_LENGTH: pant?.outsideLength,
                INSIDE_LENGTH: pant?.insideLength,
                RISE: pant?.rise,
                WAIST: pant?.waist,
                SEAT: pant?.seat,
                THIGH: pant?.thigh,
                BOTTOM: pant?.bottom,
                KNEE: pant?.knee,
                CREATED_AT: pant?.createdAt,
                UPDATED_AT: pant?.updatedAt
            }]
        });
    } catch (e) {
        await t.rollback();
        console.error(e)
        return res.status(500).json({ message: e.message });
    }
}

const getCustomers = async (req, res) => {
    try {
        const customers = await Customer.findAll()
        return res.status(200).json({
            customer: customers.map(c => ({
                ID: c.id,
                BOOKNO: c.bookno,
                NAME: c.name,
                GENDER: c.gender,
                MOB_NO: c.mob_num,
                ADDRESS: c.address,
                CREATED_AT: c.createdAt,
                UPDATED_AT: c.updatedAt
            }))
        });
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: error.message });
    }
}

const getCustomerById = async (req, res) => {
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

        if (customer.orders && customer.orders.length > 0) {
            customer.orders.forEach(order => {
                if (order.shirt) {
                    shirtMeasurements.push({
                        SHIRTID: order.shirt.id,
                        ORDER_ID: order.shirt.orderId,
                        CHEST: order.shirt.chest,
                        LENGTH: order.shirt.length,
                        SLEEVE: order.shirt.sleeve,
                        SHOULDER: order.shirt.shoulder,
                        BACK: order.shirt.back,
                        BICEP: order.shirt.bicep,
                        CUFF: order.shirt.cuff,
                        COLLAR: order.shirt.collar,
                        FRONT1: order.shirt.front1,
                        FRONT2: order.shirt.front2,
                        FRONT3: order.shirt.front3
                    });
                }
                if (order.Pant) {
                    pantMeasurements.push({
                        PANTID: order.Pant.id,
                        ORDER_ID: order.Pant.orderId,
                        RISE: order.Pant.rise,
                        WAIST: order.Pant.waist,
                        SEAT: order.Pant.seat,
                        LENGTH: order.Pant.length,
                        THIGH: order.Pant.thigh,
                        BOTTOM: order.Pant.bottom,
                        KNEE: order.Pant.knee,
                        OUTSIDE_LENGTH: order.Pant.outsideLength,
                        INSIDE_LENGTH: order.Pant.insideLength,
                    });
                }
            });
        }

        return res.status(200).json({
            customer: [{
                ID: customer.id,
                BOOKNO: customer.bookno,
                NAME: customer.name,
                GENDER: customer.gender,
                MOB_NO: customer.mob_num,
                ADDRESS: customer.address,
                CREATED_AT: customer.createdAt,
                UPDATED_AT: customer.updatedAt
            }],
            shirtMeasurements: shirtMeasurements,
            pantMeasurements: pantMeasurements
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: error.message });
    }
}

const updateCustomer = async (req, res) => {
    try {
        const { error } = customerValidation.validate(req.body)
        if (error) return res.status(400).json({ message: error.details[0].message })

        const customer = await Customer.findByPk(req.params.id)
        if (!customer) return res.status(500).json({ error: "Customer not found" })

        await customer.update({
            name: req.body.name,
            gender: req.body.gender,
            mob_num: req.body.mob_num,
            address: req.body.address
        });

        res.status(200).json({
            message: "Customer Updated",
            code: 200,
            customer: [{
                CUSTOMERID: customer.id,
                BOOKNO: customer.bookno,
                NAME: customer.name,
                GENDER: customer.gender,
                MOB_NO: customer.mob_num,
                ADDRESS: customer.address,
                CREATED_AT: customer.createdAt,
                UPDATED_AT: customer.updatedAt
            }]
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: error.message });
    }
}

const deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id)
        if (!customer) return res.status(500).json({ error: "Customer not found" })

        await Customer.destroy()
        return res.status(200).json({ message: "Customer Destroid" })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: error.message })
    }
}

module.exports = {
    createCustomer, getCustomers, getCustomerById, updateCustomer, deleteCustomer
}