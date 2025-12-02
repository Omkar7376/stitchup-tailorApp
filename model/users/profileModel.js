const { DataTypes } = require('sequelize');
const {sequelize} = require('../../config/dbConnect')

const Profile = sequelize.define(
  'Profile',
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    bio: {
        type: DataTypes.STRING,
        allowNull: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
  },
  {
    // Other model options go here
    freezeTableName: true //model == db table name
    // tableName: 'Profile',
  },
);

// `sequelize.define` also returns the model

module.exports = {Profile}