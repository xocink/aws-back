const products = require('../storage');

const getProductById = async (event) => {
  const { id } = event.pathParameters;
  const product = products.filter((el) => Number(el.id) === Number(id));

  if (!product || !product.length) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Product not found" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(product),
  };
}

module.exports = {
  getProductById
}
