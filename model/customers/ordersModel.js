const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/dbConnect");


const CustomerOrder = sequelize.define(
    "CustomerOrder", {
        id : {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        customerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        orderDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        deliveryDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        orderType: {
            type: DataTypes.STRING,
            defaultValue: "shirt"
        },
        shirtQnt: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        pantQnt: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        shirtAmount: { 
            type: DataTypes.FLOAT, 
            defaultValue: 0 
        },
        pantAmount: { 
            type: DataTypes.FLOAT, 
            defaultValue: 0 
        },
        shirtTotal: { 
            type: DataTypes.FLOAT, 
            defaultValue: 0
        },
        pantTotal: { 
            type: DataTypes.FLOAT, 
            defaultValue: 0 
        },
        totalAmount: { 
            type: DataTypes.FLOAT, 
            defaultValue: 0 
        },
        discount: { 
            type: DataTypes.FLOAT, 
            defaultValue: 0 
        },
        advanceAmount: { 
            type: DataTypes.FLOAT, 
            defaultValue: 0 
        },
        finalPayable: { 
            type: DataTypes.FLOAT, 
            defaultValue: 0 
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: "pending"
        },
        note: {
            type: DataTypes.STRING
        }
    },
    {
        freezeTableName: true
    }
)

module.exports = {CustomerOrder}