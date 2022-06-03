const express = require('express');
const {
  createProduct,
  getProducts,
  getProductsById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { productExists } = require('../middlewares/productMiddlewares');
const {
  protectToken,
  protectDeleteUser,
  userExists,
} = require('../middlewares/usersMiddlewares');
const {
  validationCreateProduct,
  checkValidation,
  validationUpdateProduct,
} = require('../middlewares/validationMiddlewares');

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', productExists, getProductsById);

router.use(protectToken);
router.post('/', validationCreateProduct, checkValidation, createProduct);
router
  .route('/:id')
  .patch(productExists, updateProduct)
  .delete(productExists, deleteProduct);

module.exports = { productsRoutes: router };
