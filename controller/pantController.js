const { pantMeasurValidation } = require("../middleware/pantMeasurValidation");
const { Customer } = require("../model/customers/customerModel");
const { CustomerOrder } = require("../model/customers/ordersModel");
const { PantMeasur } = require("../model/customers/pantMeasurementModel");
const { sequelize } = require("../config/dbConnect");
const { where, QueryTypes } = require("sequelize");
const { ShirtMeasur } = require("../model/customers/shirtMeasurementModel");

const createPantMeasur = async (req, res) => {
    try {
        const { customerId, pantData } = req.body
        const { error } = pantMeasurValidation.validate(pantData)
        if (error) return res.status(400).json({ message: error.details[0].message })

        let customer
        if (customerId) {
            customer = await Customer.findByPk(customerId)
            if (!customer) {
                return res.status(400).json({ message: "Customer not found" })
            }
        }

        /*const shirtAmount = shirtData?.amount || 0;
        const pantAmount = pantData?.amount || 0;

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
            { transaction: t })*/

        const pant = await PantMeasur.create({
            ...pantData,
            customerId: customer.id
        });

        return res.status(201).json({ 
            message : "Pant Measurement created successfully",
            code: 201,
            pant: [{
                outsideLength: pant.outsideLength,
                insideLength: pant.insideLength,
                rise: pant.rise,
                waist: pant.waist,
                seat: pant.seat,
                thigh: pant.thigh,
                knee: pant.knee,
                bottom: pant.bottom
            }]
         })
    } catch (e) {
        console.error(e)
        return res.status(500).json({ message: e.message });
    }
}

const getPantMeasurment = async (req, res) => {
    try {
        const customer = await Customer.findAll({
            include: {
                model: CustomerOrder,
                as: "orders",
                include: [{
                    model: PantMeasur,
                    as: "Pant"
                }]
            }
        })
        return res.status(200).json(customer)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: error.message });
    }
}

const getPantMeasumentById = async (req, res) => {
    try {
        const pant = await PantMeasur.findByPk(req.params.id)
        return res.status(200).json(pant)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: error.message });
    }
}

const updatePantMeasurment = async (req, res) => {
    try {
        const { error } = pantMeasurValidation.validate(req.body)
        if (error) return res.status(400).json({ message: error.details[0].message })

        const pant = await PantMeasur.findByPk(req.params.id)
        if (!pant) return res.status(404).json({ message: "Pant Measurement not found" })

        await pant.update({
            outsideLength: req.body.outsideLength,
            insideLength: req.body.insideLength,
            rise: req.body.rise,
            waist: req.body.waist,
            seat: req.body.seat,
            thigh: req.body.thigh,
            knee: req.body.knee,
            bottom: req.body.bottom
        });

        /*const order = await CustomerOrder.findOne({ where: { id: pant.orderId } });
        const pantAmount = pant.amount

        const shirt = await ShirtMeasur.findOne({ where: { orderId: order.id } });
        const shirtAmount = shirt ? shirt.amount : 0;

        const totalAmount = shirtAmount + pantAmount;
        const finalPayable = totalAmount - order.discount - order.advanceAmount;

        await order.update({
            shirtAmount,
            totalAmount,
            finalPayable
        });*/

        return res.status(200).json({
            message: "Measurmenet Updated",
            pantMeasurment: [{
                outsideLength: pant.outsideLength,
                insideLength: pant.insideLength,
                rise: pant.rise,
                waist: pant.waist,
                seat: pant.seat,
                thigh: pant.thigh,
                knee: pant.knee,
                bottom: pant.bottom
            }],
            // order
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: error.message });
    }
}

const deletePantMeasurment = async (req, res) => {
    try {
        const pant = await PantMeasur.findByPk(req.params.id)
        if (!pant) return res.status(500).json({ error: "Pant not found" })

        await pant.destroy()
        return res.status(200).json({ message: "Pant Deleted" })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createPantMeasur, getPantMeasurment, getPantMeasumentById, updatePantMeasurment, deletePantMeasurment
}