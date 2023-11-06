const AWS = require('aws-sdk');
const s3 = new AWS.S3({ region: 'eu-west-1' });

const BUCKET_NAME = process.env.BUCKET_NAME;
const importProductsFile = async (event) => {
  const origin = event.headers.origin;
  const allowedOrigins = ['https://d1gkqiqw3e8jb3.cloudfront.net', 'http://localhost:3000'];
  try {
    const fileName = event.queryStringParameters.name;
    const filePath = `uploaded/${fileName}`;

    const params = {
      Bucket: BUCKET_NAME,
      Key: filePath,
      Expires: 60 * 5,
      ContentType: 'text/csv'
    };

    const signedUrl = await s3.getSignedUrlPromise('putObject', params);

    return {
      statusCode: 200,
      body: JSON.stringify({ signedUrl }),
      headers: {
        'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
        'Access-Control-Allow-Credentials': true,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: 'Failed to create a signed URL',
      headers: {
        'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
        'Access-Control-Allow-Credentials': true,
      },
    };
  }
};

module.exports = {
  importProductsFile
}
