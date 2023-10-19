
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const getItemFromDB = async (params) => {
      return  await dynamoDb.get(params).promise();

}

const getProductById = async (event) => {
  const {id} = event.pathParameters;

  const productParams = {
    TableName: process.env.PRODUCTS_TABLE,
    Key: {'id': id}
  }
  const stockParams = {
    TableName: process.env.PRODUCTS_STOCK_TABLE,
    Key: {'product_id': id}
  }
  try {
    const productItem =await getItemFromDB(productParams);
    const stockItem =await getItemFromDB(stockParams);

    if (productItem.Item && stockItem.Item) {
      return {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        statusCode: 200,
        body: JSON.stringify({
          ...productItem.Item,
          count: stockItem.Item.count
        }),
      }
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({message:'Product not found'}),
      };
    }
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({message:'Something went wrong'}),
    };
  }
  
}

module.exports = {
  getProductById
}
