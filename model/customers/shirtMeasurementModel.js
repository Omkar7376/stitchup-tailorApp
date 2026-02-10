const { sequelize } = require("../../config/dbConnect");
const { DataTypes } = require("sequelize");

const ShirtMeasur = sequelize.define(
    'ShirtMeasurment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        customerId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        length: {
            type: DataTypes.FLOAT,
        },
        chest: {
            type: DataTypes.FLOAT,
        },
        shoulder: {
            type: DataTypes.FLOAT,
        },
        sleeve: {
            type: DataTypes.FLOAT,
        },
        collar: {
            type: DataTypes.FLOAT,
        },
        cuff: {
            type: DataTypes.FLOAT,
        },
        back: {
            type: DataTypes.FLOAT,
        },
        bicep: {
            type: DataTypes.FLOAT,
        },
        front1: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        front2: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        front3: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
    },
    {
        freezeTableName: true
    }
)

module.exports = {ShirtMeasur}