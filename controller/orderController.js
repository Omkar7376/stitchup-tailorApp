const { sequelize } = require("../config/dbConnect")
const { orderValidation } = require("../middleware/orderValidation")
const { Customer } = require("../model/customers/customerModel");
const { CustomerOrder } = require("../model/customers/ordersModel");

const createOrder = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const customerId = req.params.id
        const { orderData } = req.body
        const { error } = orderValidation.validate(orderData)
        if (error) return res.status(400).json({ message: error.details[0].message })

        const customer = await Customer.findByPk(customerId)
        if (!customer) {
            await t.rollback();
            return res.status(400).json({ message: "Customer not found" })
        }

        const shirtQnt = orderData?.shirtQnt || 0;
        const pantQnt = orderData?.pantQnt || 0;
        const shirtUnitPrice = orderData?.shirtAmount || 0;
        const pantUnitPrice = orderData?.pantAmount || 0;

        const shirtTotal = shirtQnt * shirtUnitPrice;
        const pantTotal = pantQnt * pantUnitPrice;
        const totalAmount = shirtTotal + pantTotal;
        const discount = orderData?.discount || 0;
        const advance = orderData?.advanceAmount || 0;
        const finalAmount = Math.max(0, totalAmount - discount - advance);

        const newOrder = await CustomerOrder.create({
            customerId: customer.id,
            orderDate: orderData.orderDate,
            deliveryDate: orderData.deliveryDate,
            orderType: orderData.orderType,
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
            status: orderData.status,
            note: orderData.note
        },
            { transaction: t })

        await t.commit();

        return res.status(201).json({
            message: "Orders created successfully",
            code: 201,
            order: [{
                ORDERID: newOrder.id,
                CUSTOMER_ID: newOrder.customerId,
                CUSTOMERNAME: customer.name,
                CUSTOMERMOBILE: customer.mob_num,
                ORDER_DATE: newOrder.orderDate,
                DELIVERY_DATE: newOrder.deliveryDate,
                ORDER_TYPE: newOrder.orderType,
                SHIRT_QNT: newOrder.shirtQnt,
                PANT_QNT: newOrder.pantQnt,
                SHIRT_AMOUNT: newOrder.shirtAmount,
                PANT_AMOUNT: newOrder.pantAmount,
                SHIRT_TOTAL: newOrder.shirtTotal,
                PANT_TOTAL: newOrder.pantTotal,
                TOTAL_AMOUNT: newOrder.totalAmount,
                DISCOUNT: newOrder.discount,
                ADVANCE_AMOUNT: newOrder.advanceAmount,
                FINAL_PAYABLE: newOrder.finalPayable,
                STATUS: newOrder.status,
                NOTE: newOrder.note
            }]
        })
    } catch (e) {
        await t.rollback();
        console.error(e)
        return res.status(500).json({ message: e.message });
    }

}

const getOrders = async (req, res) => {
    try {
        const orders = await CustomerOrder.findAll({
            include: [{
                model: Customer,
                attributes: ['bookno', 'name', 'mob_num']
            }]
        })

        return res.status(200).json({
            orders: orders.map(order => ({
                ORDERID: order.id,
                CUSTOMER_ID: order.customerId,
                BOOKNO: order.Customer?.bookno,
                CUSTOMER_NAME: order.Customer?.name,
                MOBILE_NO: order.Customer?.mob_num,
                ORDER_DATE: order.orderDate,
                DELIVERY_DATE: order.deliveryDate,
                ORDER_TYPE: order.orderType,
                SHIRT_QNT: order.shirtQnt,
                PANT_QNT: order.pantQnt,
                SHIRT_AMOUNT: order.shirtAmount,
                PANT_AMOUNT: order.pantAmount,
                SHIRT_TOTAL: order.shirtTotal,
                PANT_TOTAL: order.pantTotal,
                TOTAL_AMOUNT: order.totalAmount,
                DISCOUNT: order.discount,
                ADVANCE_AMOUNT: order.advanceAmount,
                FINAL_PAYABLE: order.finalPayable,
                STATUS: order.status,
                NOTE: order.note,
            }))
        });
    } catch (e) {
        console.error(e)
        return res.status(500).json({ message: e.message });
    }
}

module.exports = { createOrder, getOrders }