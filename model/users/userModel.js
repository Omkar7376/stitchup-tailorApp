const { DataTypes } = require('sequelize');
const {sequelize} = require('../../config/dbConnect')

const User = sequelize.define(
  'User',
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      // allowNull defaults to true
    },
    password: {
      type: DataTypes.STRING(64),
      allowNull: false,
      // validate: {
      //   is: /^[0-9a-f]{64}$/i,
      // }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mob_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    // Other model options go here
    //freezeTableName: true //model == db table name
    tableName: 'users',
  },
);

// `sequelize.define` also returns the model
console.log(User === sequelize.models.User); // true

module.exports = {User}