'use strict';

const {getProductsList, getProductById,createProduct,createProductOptions, catalogBatchProcess} = require('./handlers');

module.exports = {
  getProductsList,
  getProductById,
  createProduct,
  createProductOptions,
  catalogBatchProcess
};
