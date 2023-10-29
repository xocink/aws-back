const {getProductById} = require('./getProductById');
const {getProductsList} = require('./getProductsList');
const {createProduct} = require('./createProduct');
const {createProductOptions} = require('./createProductOptions');
const {catalogBatchProcess} = require('./catalogBatchProcess');

module.exports = {
  getProductsList,
  getProductById,
  createProduct,
  createProductOptions,
  catalogBatchProcess
}
