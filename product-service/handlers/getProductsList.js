const products = require('../storage');

const getProductsList = async (event) => {
  return {
    headers: {
      "Access-Control-Allow-Origin": "*",  // This is the important line for CORS
      "Access-Control-Allow-Credentials": true,
    },
    statusCode: 200,
    body: JSON.stringify(products),
  }
}

module.exports = {
  getProductsList
}
