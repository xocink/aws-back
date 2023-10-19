const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const getAllItemsFromDB = async (tableName) => {
  const params = {
    TableName: tableName,
  };
  return await dynamoDb.scan(params).promise();
}

const getProductsList = async (event) => {
  try {
    const productsList = await getAllItemsFromDB(process.env.PRODUCTS_TABLE);
    const stocksList = await getAllItemsFromDB(process.env.PRODUCTS_STOCK_TABLE);

    const resultItems = productsList.Items.map((el) => {
      const stock = stocksList.Items.find((st) => st.product_id === el.id);
      return {
        ...el,
        count: stock?.count
      }
    });
    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      statusCode: 200,
      body: JSON.stringify(resultItems),
    }

  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({message:'Something went wrong'}),
    }
  }
}

module.exports = {
  getProductsList
}
