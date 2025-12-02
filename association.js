const { Customer } = require("./model/customers/customerModel");
const { CustomerOrder } = require("./model/customers/ordersModel");
const { PantMeasur } = require("./model/customers/pantMeasurementModel");
const { ShirtMeasur } = require("./model/customers/shirtMeasurementModel");
const { Profile } = require("./model/users/profileModel");
const { User } = require("./model/users/userModel");

//User
User.hasOne(Profile, {
    foreignKey: 'userId',
    as: "profile"
});

Profile.belongsTo(User, {
    foreignKey: 'userId',
    as: "users"
});

//Customer
Customer.hasMany(CustomerOrder, {
    foreignKey: "customerId",
    as: "orders"
});

CustomerOrder.belongsTo(Customer, {
    foreignKey: "customerId",
    as: "customer"
})

//Shirt Orders
CustomerOrder.hasOne(ShirtMeasur, {
    foreignKey: "orderId",
    as: "shirt"
})

ShirtMeasur.belongsTo(CustomerOrder, {
    foreignKey: "orderId",
    as: "order"
})

//Pant Orders
CustomerOrder.hasOne(PantMeasur, {
    foreignKey: "orderId",
    as: "Pant"
})

PantMeasur.belongsTo(CustomerOrder, {
    foreignKey: "orderId",
    as: "order"
})


