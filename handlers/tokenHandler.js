// dependencies
const data = require('../lib/data');
const { hash, createRandomString } = require('../helpers/utilities');
const { paseJSON } = require('../helpers/utilities');

const handler = {};
handler._token = {};

handler.tokenHandler = (requestProperties, callback) => {
  const acceptedMethods = ['get', 'post', 'put', 'delete'];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._token[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handler._token.post = (requestProperties, callback) => {
  const mobile =
    typeof requestProperties.body.mobile === 'string' &&
    requestProperties.body.mobile.trim().length > 0
      ? requestProperties.body.mobile
      : false;

  const password =
    typeof requestProperties.body.password === 'string' &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;
  if (mobile && password) {
    data.read('users', mobile, (err1, userData) => {
      const hashedPassword = hash(password);
      if (hashedPassword === paseJSON(userData).password) {
        const tokenId = createRandomString(20);
        const expires = Date.now() * 60 * 60 * 1000;
        const tokenObj = {
          mobile,
          id: tokenId,
          expires,
        };
        data.create('tokens', tokenId, tokenObj, (err2) => {
          if (!err2) {
            callback(200, tokenObj);
          } else {
            callback(500, { error: 'There have a problem in server side' });
          }
        });
      } else {
        callback(400, { error: 'Password is not valid' });
      }
    });
  } else {
    callback(404, { error: 'You have a problem in your request' });
  }
};

handler._token.get = (requestProperties, callback) => {
  // check the id if valid
  const id =
    typeof requestProperties.queryStringObj.id === 'string' &&
    requestProperties.queryStringObj.id.length === 19
      ? requestProperties.queryStringObj.id
      : false;
  if (id) {
    data.read('tokens', id, (err, tokenData) => {
      const token = { ...paseJSON(tokenData) };
      if (!err && token) {
        callback(200, token);
      } else {
        callback(404, { error: 'Token was not found' });
      }
    });
  } else {
    callback(404, { error: 'Requested token was not found' });
  }
};

handler._token.put = (requestProperties, callback) => {
  const id =
    typeof requestProperties.body.id === 'string' &&
    requestProperties.body.id.trim().length === 19
      ? requestProperties.body.id
      : false;
  const extend =
    typeof requestProperties.body.extend === 'boolean' &&
    requestProperties.body.extend === true
      ? requestProperties.body.extend
      : false;

  if (id && extend) {
    data.read('tokens', id, (err, tokenData) => {
      let tokenObject = paseJSON(tokenData);
      if (tokenObject.expires > Date.now()) {
        tokenObject.expires = Date.now() * 60 * 60 * 1000;
        // store the updated token
        data.update('tokens', id, tokenObject, (err2) => {
          if (!err2) {
            callback(200);
          } else {
            callback(500, { error: 'There was a server error' });
          }
        });
      } else {
        callback(400, { error: 'Token already expired' });
      }
    });
  } else {
    callback(400, { error: 'There was a problem in your request' });
  }
};
handler._token.delete = (requestProperties, callback) => {
  // check validity of id
  const id =
    typeof requestProperties.queryStringObj.id === 'string' &&
    requestProperties.queryStringObj.id.trim().length === 19
      ? requestProperties.queryStringObj.id
      : false;
  if (id) {
    data.read('tokens', id, (err, tokenData) => {
      if (!err && tokenData) {
        data.delete('tokens', id, (err2) => {
          if (!err2) {
            callback(200, { message: 'The token deleted successfully' });
          } else {
            500, { error: 'There was a server side error' };
          }
        });
      } else {
        callback(500, { error: 'There was a server side error' });
      }
    });
  } else {
    callback(400, {
      error: 'You have a problem in your request, please try again!!!',
    });
  }
};

module.exports = handler;
