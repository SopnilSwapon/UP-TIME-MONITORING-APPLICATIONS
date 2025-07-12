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

handler._token.get = (requestProperties, callback) => {};

handler._token.put = (requestProperties, callback) => {};
handler._token.delete = (requestProperties, callback) => {};

module.exports = handler;
