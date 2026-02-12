const { sequelize } = require("../config/dbConnect")
const { shirtMeasurValidation } = require("../middleware/shirtMeasurValidation")
const { Customer } = require("../model/customers/customerModel")
const { ShirtMeasur } = require('../model/customers/shirtMeasurementModel')
const { CustomerOrder } = require("../model/customers/ordersModel")
const { PantMeasur } = require("../model/customers/pantMeasurementModel")

const createShirtMeasur = async (req, res) => {
    try {
        const customerId = req.params.id
        const { shirtData } = req.body
        const { error } = shirtMeasurValidation.validate(shirtData)
        if (error) return res.status(400).json({ message: error.details[0].message })

        const customer = await Customer.findByPk(customerId)

        if (!customer) {
            return res.status(400).json({ message: "Customer not found" })
        }

        /*const shirtQnt = shirtData?.shirtQnt || 0;
        const pantQnt = pantData?.PantQnt || 0;
        const shirtAmount = shirtData?.amount || 0;
        const pantAmount = pantData?.amount || 0;

        const shirtTotal = shirtQnt * shirtAmount;
        const pantTotal = pantQnt * pantAmount;
        const totalAmount = shirtTotal + pantTotal;
        const discount = order.discount || 0;
        const advance = order.advanceAmount || 0;
        const finalAmount = totalAmount - discount - advance;

        const newOrder = await CustomerOrder.create({
            customerId: customer.id,
            orderDate: order.orderDate,
            deliveryDate: order.deliveryDate,
            orderType: order.orderType,
            shirtQnt: shirtQnt,
            pantQnt: pantQnt,
            shirtAmount: shirtAmount,
            pantAmount: pantTotal,
            totalAmount: totalAmount,
            discount: discount,
            advanceAmount: advance,
            finalPayable: finalAmount,
            status: order.status,
            note: order.note
        },
            { transaction: t })*/

        const existing = await ShirtMeasur.findOne({
            where: { customerId }
        })

        if (existing) {
            return res.status(400).json({ message: "Shirt Measurement already exists for this customer" })
        } else {
            await ShirtMeasur.create({
                ...shirtData,
                customerId: customer.id
            })
        }

        return res.status(201).json({
            message: "Shirt Measurement created successfully",
            code: 201,
            shirt: [{
                length: shirt.length,
                chest: shirt.chest,
                shoulder: shirt.shoulder,
                sleeve: shirt.sleeve,
                collar: shirt.collar,
                cuff: shirt.cuff,
                back: shirt.back,
                bicep: shirt.bicep,
                front1: shirt.front1,
                front2: shirt.front2,
                front3: shirt.front3,
                createdAt: shirt.createdAt,
                updatedAt: shirt.updatedAt
            }]
        })
    } catch (e) {
        console.error(e)
        return res.status(500).json({ message: e.message });
    }
}

const getShirtMeasument = async (req, res) => {
    try {
        const customer = await Customer.findAll({
            include: [{
                model: ShirtMeasur,
                as: "shirt"
            }]
        });
        return res.status(200).json(customer)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: error.message });
    }
}

const getShirtMeasumentById = async (req, res) => {
    const shirtId = ShirtMeasur.id;
    try {
        const shirt = await ShirtMeasur.findByPk(req.params.id)
        return res.status(200).json(shirt)
    } catch (error) {
        s
        console.error(error)
        return res.status(500).json({ message: error.message });
    }
}

const updateShirt = async (req, res) => {
    try {
        const { error } = shirtMeasurValidation.validate(req.body)
        if (error) return res.status(400).json({ message: error.details[0].message })

        const shirt = await ShirtMeasur.findByPk(req.params.id);
        if (!shirt) return res.status(404).json({ message: "Shirt Measurement not found" });

        await shirt.update({
            length: req.body.length,
            chest: req.body.chest,
            shoulder: req.body.shoulder,
            sleeve: req.body.sleeve,
            collar: req.body.collor,
            cuff: req.body.cuff,
            back: req.body.back,
            bicep: req.body.bicep,
            front1: req.body.front1,
            front2: req.body.front2,
            front3: req.body.front3
        });

        /*const order = await CustomerOrder.findOne({ where: { id: shirt.orderId } });
        const shirtAmount = shirt.amount;

        const pant = await PantMeasur.findOne({ where: { orderId: order.id } });
        const pantAmount = pant ? pant.amount : 0;

        const totalAmount = shirtAmount + pantAmount;
        const finalPayable = totalAmount - order.discount - order.advanceAmount;

        await order.update({
            shirtAmount,
            totalAmount,
            finalPayable
        });*/

        return res.status(200).json({
            code: 200,
            message: "Measurmenet Updated",
            shirtMeasurment: [{
                length: shirt.length,
                chest: shirt.chest,
                shoulder: shirt.shoulder,
                sleeve: shirt.sleeve,
                collor: shirt.collor,
                cuff: shirt.cuff,
                back: shirt.back,
                bicep: shirt.bicep,
                front1: shirt.front1,
                front2: shirt.front2,
                front3: shirt.front3
            }],
            // order
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: error.message });
    }
}

const deleteShirt = async (req, res) => {
    try {
        const shirt = await ShirtMeasur.findByPk(req.params.id)
        if (!shirt) return res.status(500).json({ error: "Shirt not found" })

        await shirt.destroy()
        return res.status(200).json({ message: "Shirt is deleted" })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createShirtMeasur, getShirtMeasument, getShirtMeasumentById, updateShirt, deleteShirt
}