const data = require('../lib/data');
const { createRandomString } = require('../helpers/utilities');
const { paseJSON } = require('../helpers/utilities');
const { _token } = require('../handlers/tokenHandler');
const { maxChecks } = require('../helpers/environments');

const handler = {};

const acceptedMethods = ['get', 'post', 'put', 'delete'];
handler.checkHandler = (requestProperties, callback) => {
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._check[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};
handler._check = {};

handler._check.post = (requestProperties, callback) => {
  // input validations
  const protocol =
    typeof requestProperties.body.protocol === 'string' &&
    ['http', 'https'].indexOf(requestProperties.body.protocol) > -1
      ? requestProperties.body.protocol
      : false;

  const url =
    typeof requestProperties.body.url === 'string' &&
    requestProperties.body.url.trim().length > 0
      ? requestProperties.body.url
      : false;

  const method =
    typeof requestProperties.body.method === 'string' &&
    acceptedMethods.indexOf(requestProperties.body.method) > -1
      ? requestProperties.body.method
      : false;

  const successCodes =
    typeof requestProperties.body.successCodes === 'object' &&
    requestProperties.body.successCodes instanceof Array
      ? requestProperties.body.successCodes
      : false;
  const timeoutSeconds =
    typeof requestProperties.body.timeoutSeconds === 'number' &&
    requestProperties.body.timeoutSeconds &&
    requestProperties.body.timeoutSeconds % 1 === 0 &&
    requestProperties.body.timeoutSeconds >= 1 &&
    requestProperties.body.timeoutSeconds <= 5
      ? requestProperties.body.timeoutSeconds
      : false;
  if (protocol && url && method && successCodes && timeoutSeconds) {
    const token =
      typeof requestProperties.headersObject.token === 'string'
        ? requestProperties.headersObject.token
        : false;
    // looked up the users phone by reading the token

    data.read('tokens', token, (err2, tokenData) => {
      if (!err2 && tokenData) {
        let userMobile = paseJSON(tokenData).mobile;
        // looked up the user data
        data.read('users', userMobile, (err3, userData) => {
          if (!err3 && userData) {
            _token.verify(token, userMobile, (tokenIsValid) => {
              if (tokenIsValid) {
                let userObject = paseJSON(userData);
                let userChecks =
                  typeof userObject.checks === 'object' &&
                  userObject.checks instanceof Array
                    ? userObject.checks
                    : [];
                if (userChecks.length < maxChecks) {
                  let checkId = createRandomString(19);
                  let checkObject = {
                    id: checkId,
                    userMobile,
                    url,
                    method,
                    successCodes,
                    timeoutSeconds,
                  };
                  data.create('checks', checkId, checkObject, (err4) => {
                    if (!err4) {
                      // add check id to the user object
                      userObject.checks = userChecks;
                      userObject.checks.push(checkId);
                      // save the new user data;

                      data.update('users', userMobile, userObject, (err5) => {
                        if (!err5) {
                          // return the data about the new check
                          callback(200, checkObject);
                        } else {
                          500, { error: 'There was a problem in server side' };
                        }
                      });
                    } else {
                      500, { error: 'There was a problem in server side' };
                    }
                  });
                } else {
                  401, { error: 'User has already reached max check limit' };
                }
              } else {
                403, { error: 'Authentication failed' };
              }
            });
          } else {
            callback(403, { error: 'User not found' });
          }
        });
      } else {
        callback(403, { error: 'Authentication problem' });
      }
    });
  } else {
    callback(400, { error: 'You have a problem in your request' });
  }
};
handler._check.get = (requestProperties, callback) => {};
handler._check.put = (requestProperties, callback) => {};
handler._check.delete = (requestProperties, callback) => {};

module.exports = handler;
