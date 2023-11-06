const { Buffer } = require('node:buffer');

const parseBasicAuth = (authHeader) => {
  const b64auth = authHeader.split(' ')[1];
  const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');
  return { login, password };
};

const basicAuthorizer = async (event, context, callback) => {
  if (!event.authorizationToken) {
    return callback('Unauthorized'); // HTTP 401
  }

  try {
    const { login, password } = parseBasicAuth(event.authorizationToken);
    const envPassword = process.env[login];

    const effect = envPassword && envPassword === password ? 'Allow' : 'Deny';

    const policyDocument = {
      Version: '2012-10-17',
      Statement: [{
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: event.methodArn,
      }],
    };

    const authResponse = {
      principalId: login,
      policyDocument,
    };

    if (effect === 'Allow') {
      callback(null, authResponse);
    } else {
      console.log('we here2')
      return callback('Forbidden'); // HTTP 403
    }
  } catch (e) {
    console.log('we here')
    return callback('Forbidden'); // HTTP 403
  }
};


module.exports = {
  basicAuthorizer
}
