const { Cart } = require("./cartsModel");
const { Order } = require("./ordersModel");
const { ProductInCart } = require("./productsInCartModel");
const { Product } = require("./productsModel");
const { User } = require("./userModel");
const { Categories } = require('./categoriesModel')
const { ProductImg } = require('./productImgsModel')


// Establish your models relations inside thins function
const initModel = () => {
    
    // 1 User <--> M Products
    User.hasMany(Product)
    Product.belongsTo(User)

    // 1 User <--> Orders    
    User.hasMany(Order)
    Order.belongsTo(User)

    // 1 User <--> 1 Cart
    User.hasOne(Cart)
    Cart.belongsTo(User)

    Categories.hasOne(Product)
    Product.belongsTo(Categories)

    Product.hasMany(ProductImg)
    ProductImg.belongsTo(Product)

    Product.hasOne(ProductInCart)
    ProductInCart.belongsTo(Product)    

    Cart.hasMany(ProductInCart)
    ProductInCart.belongsTo(Cart)
    
    Cart.hasOne(Order)
    Order.belongsTo(Cart)
};

module.exports = { initModel };
