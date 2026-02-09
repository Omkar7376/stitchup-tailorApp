const { sequelize } = require("../../config/dbConnect");
const { DataTypes } = require("sequelize");

const PantMeasur = sequelize.define(
    'PantMeasurment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        orderId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        outsideLength: {
            type: DataTypes.FLOAT,
        },
        insideLength: {
            type: DataTypes.FLOAT,
        },  
        rise: {
            type: DataTypes.FLOAT,
        },
        waist: {
            type: DataTypes.FLOAT,
        },
        seat: {
            type: DataTypes.FLOAT,
        },
        thigh: {
            type: DataTypes.FLOAT,
        },
        knee: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        bottom: {
            type: DataTypes.FLOAT,
        },      
    },
    {
        freezeTableName: true
    }
)

module.exports = {PantMeasur}