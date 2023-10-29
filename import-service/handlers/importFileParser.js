const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const csvParser = require('csv-parser');
const sqs = new AWS.SQS();

const sendToSQS = async (data) => {
  try {
    console.log(process.env.SQS_URL)
    await sqs.sendMessage({
      QueueUrl: process.env.SQS_URL,
      MessageBody: JSON.stringify(data),
    }).promise();

  } catch (error) {
    console.error(`Error sending message to SQS: ${error.message}`);
  }
}

const processStream = (record) => {
  return new Promise(async(resolve, reject) => {
    let sendPromises = [];

    const s3Stream = s3.getObject({
      Bucket: record.s3.bucket.name,
      Key: record.s3.object.key
    }).createReadStream();

    s3Stream.pipe(csvParser())
      .on('data', (data) => {
        console.log('record');
        sendPromises.push(sendToSQS(data));
      })
      .on('end', async () => {
        await Promise.all(sendPromises);

      })
      .on('error', (error) => {
        console.error(`Error while parsing file ${record.s3.object.key}: ${error.message}`);
        reject(error);
      });
  });
};


const importFileParser = async (event) => {
  const processingPromises = event.Records.map(record => processStream(record));
  await Promise.all(processingPromises);
};

module.exports = {
  importFileParser
}
