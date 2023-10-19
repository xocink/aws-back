const AWS = require('aws-sdk');
const client = new AWS.DynamoDB.DocumentClient();
const {v4: uuidv4} = require('uuid');

const updateProductsTable = async (params) => {
  const item = {
    TableName: process.env.PRODUCTS_TABLE,
    Item: params,
  }
  return await client.put(item).promise()
}

const updateStockTable = async (params) => {
  const item = {
    TableName: process.env.PRODUCTS_STOCK_TABLE,
    Item: params,
  }
  return await client.put(item).promise()
}

function validateData(product) {
  const requiredFields = ['count', 'price', 'description', 'title'];
  for (const field of requiredFields) {
    if (!product.hasOwnProperty(field)) {
      return {valid: false, message: `Error: Missing required field: ${field}`};
    }
  }
  return {valid: true, message: `Success: Product created`}
}

const createProduct = async (event) => {
  const id = uuidv4();
  const data = JSON.parse(event.body);
  const {valid, message} = validateData(data);

  if (!valid) {
    return {
      statusCode: 404,
      body: JSON.stringify({message}),
    };
  }

  const item = {
    id: id,
    title: data.title,
    description: data.description,
    price: data.price,
    image: data.image || '',
  };

  const stockItem = {
    product_id: id,
    count: data.count
  };

  await updateProductsTable(item);
  await updateStockTable(stockItem);

  return {
    headers: {
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Origin': '*',
    },
    statusCode: 200,
    body: JSON.stringify(message),
  };
}

module.exports = {
  createProduct
}
