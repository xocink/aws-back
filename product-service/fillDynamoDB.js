const AWS = require('aws-sdk');

AWS.config.update({region: 'eu-west-1'});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const {v4: uuidv4} = require('uuid');

const countArr = [10, 20, 30, 40, 50, 60, 70, 80]
const mockProductsData = [
  {
    id: uuidv4(),
    price: 31,
    description: 'Test Description 1',
    title: 'Test Title 1'
  },
  {
    id: uuidv4(),
    price: 32,
    description: 'Test Description 2',
    title: 'Test Title 2'
  },
  {
    id: uuidv4(),
    price: 33,
    description: 'Test Description 3',
    title: 'Test Title 3'
  },
  {
    id: uuidv4(),
    price: 34,
    description: 'Test Description 4',
    title: 'Test Title 4'
  },
  {
    id: uuidv4(),
    price: 35,
    description: 'Test Description 5',
    title: 'Test Title 5'
  },
  {
    id: uuidv4(),
    price: 36,
    description: 'Test Description 6',
    title: 'Test Title 6'
  }
];

const mockStockData = mockProductsData.map((item, i) => {
  return {
    product_id: item.id,
    count: countArr[i]
  }
});

mockProductsData.forEach(item => {
  const params = {
    TableName: 'aws_courses_products',
    Item: item
  };

  dynamoDB.put(params, (error, data) => {
    if (error) {
      console.error(`Unable to add item. Error: ${JSON.stringify(error, null, 2)}`);
    } else {
      console.log(`Item added: ${JSON.stringify(data, null, 2)}`);
    }
  });
});

mockStockData.forEach(item => {
  const params = {
    TableName: 'AWS_courses_stocks',
    Item: item
  };

  dynamoDB.put(params, (error, data) => {
    if (error) {
      console.error(`Unable to add item. Error: ${JSON.stringify(error, null, 2)}`);
    } else {
      console.log(`Item added: ${JSON.stringify(data, null, 2)}`);
    }
  });
});
