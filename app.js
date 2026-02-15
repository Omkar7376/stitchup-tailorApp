const express = require('express');
const { userRouter } = require('./routes/userRouter');
const { customerRouter } = require('./routes/customerRouter');
const { shirtRouter } = require('./routes/shirtRouter');
const { pantRouter } = require('./routes/pantRouter');
const { orderRouter } = require('./routes/orderRouter');
const {checkApiKey} = require('./middleware/checkApiKey')

require('./association')

const app = express();

app.use(express.json());
app.use(checkApiKey)

app.use("/user", userRouter)
app.use("/customer", customerRouter)
app.use("/shirt", shirtRouter)
app.use("/pant", pantRouter)
app.use("/order", orderRouter)
//User.sync();
//User.sync({force : true});
//User.sync({alter : true});

//sequelize.sync({force:true});

module.exports = app        