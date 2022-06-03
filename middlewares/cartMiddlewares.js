const { Cart } = require("../models/cartsModel");
const { ProductInCart } = require("../models/productsInCartModel");
const { catchAsync } = require("../utils/catchAsync");

const cartExists = catchAsync( async( req, res, next ) => {

    const { id:userId } = req.session
    
    const cart = await Cart.findOne( { where: { userId, status:'active' }, include: [{model: ProductInCart, where:{status:'active'}}] } )    

    req.cartInfo = cart   
    

    next();
} )


module.exports = { cartExists }