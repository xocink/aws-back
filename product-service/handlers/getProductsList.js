const products = require('../storage');

const getProductsList = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({products}),
  }
}

module.exports = {
  getProductsList
}
