const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('tailor', 'root', 'Omkar0814', {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,  
    min: 2,
    acquire: 30000,
    idle: 10000
  }
});

const dbConnection = async() =>{
      try {
        await sequelize.authenticate();
        console.log('DB Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}

module.exports = {dbConnection, sequelize}