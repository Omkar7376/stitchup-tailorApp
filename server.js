const http = require('http')
const app = require('./app');
const { dbConnection, sequelize } = require('./config/dbConnect');
require('./association')
require('dotenv').config();

const port = process.env.DB_PORT;

(async () => {
    try {
      await dbConnection();
      //sawait sequelize.sync({ force: true });
      //await sequelize.sync({ alter: true });
      console.log('Database synchronized successfully.');
  
      const server = http.createServer(app);
      server.listen(port, () => console.log(`Server running on port ${port}`));
    } catch (e) {
      console.error('Error starting server:', e);
    }
  })();
  
