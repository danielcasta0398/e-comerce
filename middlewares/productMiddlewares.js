const { Product } = require('../models/productsModel');
const { AppError } = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

const productExists = catchAsync(async (req, res, next) => {  

  const { id } = req.params;
  const searchProduct = await Product.findOne({
    where: { id, status: 'active' },
  });

  if (!searchProduct) {
    return next(new AppError('The product does not exist with that id', 404));
  }

  req.product = searchProduct;

  next();
});


module.exports = { productExists };
