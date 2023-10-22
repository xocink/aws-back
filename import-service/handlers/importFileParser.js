const AWS = require('aws-sdk');
const s3 = new AWS.S3({ region: 'eu-west-1' });
const csvParser = require('csv-parser');

const moveFile = async (bucketName, originalKey, parsedKey) => {

  await s3.copyObject({
    Bucket: bucketName,
    CopySource: `${bucketName}/${originalKey}`,
    Key: parsedKey
  }).promise();

  await s3.deleteObject({
    Bucket: bucketName,
    Key: originalKey
  }).promise();

  console.log(`File ${originalKey} moved to ${parsedKey}`);
};

const processStream = (record) => {
  return new Promise(async(resolve, reject) => {
    const bucketName = record.s3.bucket.name;
    const originalKey = record.s3.object.key;
    const parsedKey = originalKey.replace('uploaded', 'parsed');

    const s3Stream = s3.getObject({
      Bucket: record.s3.bucket.name,
      Key: record.s3.object.key
    }).createReadStream();

    s3Stream.pipe(csvParser())
      .on('data', (data) => {
        console.log('record');
        console.log(data);
      })
      .on('end', () => {
        console.log(`Parsing finished for file ${record.s3.object.key}`);
        moveFile(bucketName, originalKey, parsedKey).then(resolve).catch(reject);
      })
      .on('error', (error) => {
        console.error(`Error while parsing file ${record.s3.object.key}: ${error.message}`);
        reject(error);
      });
  });
};

const importFileParser = async (event) => {
  console.log('File added to S3 uploaded folder');
  const processingPromises = event.Records.map(record => processStream(record));
  await Promise.all(processingPromises);
};
module.exports = {
  importFileParser
}
