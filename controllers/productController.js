const { Product } = require('../models/productsModel');
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

const createProduct = catchAsync(async (req, res, next) => {
  const { title, description, price, quantity } = req.body;
  const { id: userId } = req.session;

  const createProduct = await Product.create({
    title,
    description,
    quantity,
    price,
    userId,
  });

  res.status(200).json({ createProduct });
});

const getProducts = catchAsync(async (req, res, next) => {
  const getAllProducts = await Product.findAll({ where: { status: 'active' } });
  res.status(200).json({ getAllProducts });
});

const getProductsById = catchAsync(async (req, res, next) => {
  const { product } = req;
  res.status(200).json({ product });
});

const updateProduct = catchAsync(async (req, res, next) => {
  const { product } = req;
  const { id: userId } = req.session;
  const { title, description, price, quantity } = req.body;

  if (product.userId !== userId) {
    return next(new AppError('You can only modify your products', 403));
  }
  await product.update({ title, description, price, quantity });

  res.status(200).json({ status: 'success' });
});

const deleteProduct = catchAsync(async (req, res, next) => {
  const { product } = req;
  const { id: userId } = req.session;  

  if (product.userId !== userId) {
    return next(new AppError('You can only delete your products', 403));
  }
  await product.update({ status: 'delete' });

  res.status(200).json({ status: 'success' });
});

module.exports = {
  createProduct,
  getProducts,
  getProductsById,
  updateProduct,
  deleteProduct
};
