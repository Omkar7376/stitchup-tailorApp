const { Customer } = require("./model/customers/customerModel");
const { CustomerOrder } = require("./model/customers/ordersModel");
const { PantMeasur } = require("./model/customers/pantMeasurementModel");
const { ShirtMeasur } = require("./model/customers/shirtMeasurementModel");
const { User } = require("./model/users/userModel");

User.hasMany(Customer, {
    foreignKey: "userId",
    as: "customers"
})

Customer.belongsTo(User, {
    foreignKey: "userId",
    as: "user"
})

//Customer
Customer.hasMany(CustomerOrder, {
    foreignKey: "customerId",
    as: "orders"
});

CustomerOrder.belongsTo(Customer, {
    foreignKey: "customerId",
    as: "customer"
})

//Shirt
Customer.hasOne(ShirtMeasur, {
    foreignKey: "customerId",
    as: "shirt"
})

ShirtMeasur.belongsTo(Customer, {
    foreignKey: "customerId",
    as: "customer"
})

//Pant 
Customer.hasOne(PantMeasur, {
    foreignKey: "customerId",
    as: "Pant"
})

PantMeasur.belongsTo(Customer, {
    foreignKey: "customerId",
    as: "customer"
})


