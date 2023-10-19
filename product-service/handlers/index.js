const {getProductById} = require('./getProductById');
const {getProductsList} = require('./getProductsList');
const {createProduct} = require('./createProduct');
const {createProductOptions} = require('./createProductOptions');

module.exports = {
  getProductsList,
  getProductById,
  createProduct,
  createProductOptions
}
