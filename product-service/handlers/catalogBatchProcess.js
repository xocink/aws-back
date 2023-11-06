const AWS = require('aws-sdk');
const sns = new AWS.SNS();
const {createProduct} = require('./createProduct');

const messageSuccess = {
  Subject: "Products Created!",
  Message: "Products have been successfully created.",
  TopicArn: process.env.SNS_TOPIC_ARN,
};

const messageFailed = {
  Subject: "Products Not Created!",
  Message: "Products not created check input.",
  TopicArn: process.env.SNS_TOPIC_ARN,
};


const catalogBatchProcess = async (event) => {
  try {
    const promiseList = event.Records.map((el) => {
      return createProduct(el)
    })
    const results = await Promise.all(promiseList);
    await Promise.all(results.map((el) => {
      if (el.statusCode === 200) {
        return  sns.publish(messageSuccess).promise();
      } else {
        return  sns.publish(messageFailed).promise();
      }
    }))
  } catch (e) {
    console.log(e)
  }
}

module.exports = {
  catalogBatchProcess
}
