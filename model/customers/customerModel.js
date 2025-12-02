const { sequelize } = require("../../config/dbConnect");
const { DataTypes } = require("sequelize");

const Customer = sequelize.define(
    'customer', {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        age:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },  
        gender:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        mob_num:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },  
    },
    {
        freezeTableName : true
    }
);

module.exports = {Customer}