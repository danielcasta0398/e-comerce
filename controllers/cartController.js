const { Cart } = require('../models/cartsModel');
const { Product } = require('../models/productsModel');
const { ProductInCart } = require('../models/productsInCartModel');
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');
const { Order } = require('../models/ordersModel');

const addProductCart = catchAsync(async (req, res, next) => {
  const { id: userId } = req.session;
  const { cartInfo } = req;
  const { productId, quantity } = req.body;

  if (cartInfo) {
    const activeProduct = await ProductInCart.findOne({ where: { productId } });
    const product = await Product.findOne({ where: { id: productId } });
    if (quantity > product.quantity) {
      return next(
        new AppError(`There are only ${product.quantity} units available`, 404)
      );
    }

    console.log(activeProduct);

    if (activeProduct && activeProduct.status === 'active') {
      return next(new AppError('The product is already added'), 404);
    }

    if (activeProduct && activeProduct.status === 'removed') {
      await activeProduct.update({ status: 'active', quantity });
      return res.status(200).json({ activeProduct });
    }

    await ProductInCart.create({
      cartId: cartInfo.id,
      productId,
      quantity,
    });
  } else {
    const product = await Product.findOne({ where: { id: productId } });
    if (quantity > product.quantity) {
      return next(
        new AppError(`There are only ${product.quantity} units available`, 404)
      );
    }
    const { id: cartId } = await Cart.create({ userId });

    await ProductInCart.create({ cartId, productId, quantity });
  }

  res.status(200).json({});
});

const updateCart = catchAsync(async (req, res, next) => {
  const { productId, newQty } = req.body;
  const { cartInfo } = req;
  const product = await Product.findOne({ where: { id: productId } });
  const products = await ProductInCart.findOne({
    where: { cartId: cartInfo.id, productId },
  });

  // Search product exists in the ProductInCart

  if (!products) {
    return next(new AppError(`The product does not exist with that id`, 403));
  }

  if (newQty > product.quantity) {
    return next(
      new AppError(`There are only ${product.quantity} units available`, 404)
    );
  }

  if (newQty === 0) {
    await products.update({ status: 'removed' });
  }

  await products.update({ quantity: newQty });

  res.status(200).json({ status: 'success' });
});

const cartProductDelete = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const { cartInfo } = req;
  const products = await ProductInCart.findOne({
    where: { cartId: cartInfo.id, productId },
  });

  // Search product exists in the ProductInCart

  if (!products) {
    return next(new AppError(`The product does not exist with that id`, 403));
  }

  await products.update({ status: 'removed', quantity: 0 });
  console.log(productId);

  res.status(200).json({ status: 'success' });
});

const purchase = catchAsync(async (req, res, next) => {
  const { cartInfo } = req;
  let totalPrice = 0;

  const cartPromises = cartInfo.productInCarts.map(async product => {
    const products = await Product.findOne({ where: { id: product.id } });

    await products.update({ quantity: products.quantity - product.quantity });
    let priceUnid = product.quantity * products.price;
    totalPrice += priceUnid;

    return await product.update({ status: 'purchase' });
  });

  await Promise.all(cartPromises);
  const newOrder = await Order.create({
    userId: cartInfo.userId,
    cartId: cartInfo.id,
    totalPrice,
  });
  await cartInfo.update({ status: 'purchase' });
  res.status(200).json({ newOrder });
});

module.exports = { addProductCart, updateCart, cartProductDelete, purchase };
