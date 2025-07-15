// dependencies
const data = require('../lib//data');
const { hash } = require('../helpers/utilities');
const { paseJSON } = require('../helpers/utilities');
const { _token } = require('../handlers/tokenHandler');

const handler = {};

handler.userHandler = (requestProperties, callback) => {
  const acceptedMethods = ['get', 'post', 'put', 'delete'];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._user[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handler._user = {};

handler._user.post = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties.body.firstName === 'string' &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;
  const lastName =
    typeof requestProperties.body.lastName === 'string' &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;
  const mobile =
    typeof requestProperties.body.mobile === 'string' &&
    requestProperties.body.mobile.trim().length === 11
      ? requestProperties.body.mobile
      : false;

  const password =
    typeof requestProperties.body.password === 'string' &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;
  const tosAgreement =
    typeof requestProperties.body.tosAgreement === 'boolean'
      ? requestProperties.body.tosAgreement
      : false;

  if (firstName && lastName && mobile && password && tosAgreement) {
    // make sure that the user doesn't already exists
    data.read('users', mobile, (err) => {
      if (err) {
        let userObj = {
          firstName,
          lastName,
          mobile,
          password: hash(password),
          tosAgreement,
        };
        // store data to database
        data.create('users', mobile, userObj, (err2) => {
          if (!err2) {
            callback(200, { message: 'The user was created successfully' });
          } else {
            callback(500, { error: "Couldn't created the user" });
          }
        });
      } else {
        callback(500, {
          error: 'There have already a user',
        });
      }
    });
  } else {
    callback(400, {
      error: 'You have a problem in your request',
    });
  }
};

handler._user.get = (requestProperties, callback) => {
  // check validity of mobile
  const mobile =
    typeof requestProperties.queryStringObj.mobile === 'string' &&
    requestProperties.queryStringObj.mobile.trim().length === 11
      ? requestProperties.queryStringObj.mobile
      : false;

  if (mobile) {
    // token verify
    const token =
      typeof requestProperties.headersObject.token === 'string'
        ? requestProperties.headersObject.token
        : false;
    _token.verify(token, mobile, (tokenId) => {
      if (tokenId) {
        // looked up the user
        data.read('users', mobile, (error, u) => {
          const user = { ...paseJSON(u) };
          if (!error && user) {
            delete user.password;
            callback(200, user);
          } else {
            callback(404, { error: 'Requested user not found' });
          }
        });
      } else {
        callback(403, { error: 'Authentication failed' });
      }
    });
  } else {
    callback(404, { error: 'Requested user not foundsssssssss' });
  }
};

handler._user.put = (requestProperties, callback) => {
  // check validity of mobile number;
  const mobile =
    typeof requestProperties.body.mobile === 'string' &&
    requestProperties.body.mobile.trim().length === 11
      ? requestProperties.body.mobile
      : false;

  const firstName =
    typeof requestProperties.body.firstName === 'string' &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;
  const lastName =
    typeof requestProperties.body.lastName === 'string' &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;

  const password =
    typeof requestProperties.body.password === 'string' &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;
  if (mobile) {
    if (firstName || lastName || password) {
      // looked up the user
      const token =
        typeof requestProperties.headersObject.token === 'string'
          ? requestProperties.headersObject.token
          : false;
      _token.verify(token, mobile, (tokenId) => {
        if (tokenId) {
          data.read('users', mobile, (error, userData) => {
            if ((!error, userData)) {
              if (firstName) {
                data.firstName = firstName;
              }
              if (lastName) {
                data.lastName = lastName;
              }
              if (password) {
                data.password = hash(password);
              }
              data.update('users', mobile, userData, (error) => {
                if (!error) {
                  callback(200, { message: 'User updated successfully' });
                } else {
                  callback(500, {
                    error: 'There have a problem in server side',
                  });
                }
              });
            } else {
              callback(400, { error: 'You have a problem in your request' });
            }
          });
        } else {
          callback(403, { error: 'Authentication failed' });
        }
      });
    } else {
      callback(400, { error: 'You have a problem in your request' });
    }
  } else {
    callback(400, { error: 'Invalid mobile number, please try again!' });
  }
};

handler._user.delete = (requestProperties, callback) => {
  // check validity of phone number
  const mobile =
    typeof requestProperties.body.mobile === 'string' &&
    requestProperties.body.mobile.trim().length === 11
      ? requestProperties.body.mobile
      : false;
  if (mobile) {
    const token =
      typeof requestProperties.headersObject.token === 'string'
        ? requestProperties.headersObject.token
        : false;
    _token.verify(token, mobile, (tokenId) => {
      if (tokenId) {
        // looked up the user
        data.read('users', mobile, (err, userData) => {
          if (!err && userData) {
            data.delete('users', mobile, (error) => {
              if (!error) {
                callback(200, { message: 'The user deleted successfully' });
              } else {
                callback(500, { error: 'There was a problem in server side' });
              }
            });
          } else {
            500, { message: 'There was a problem in server side' };
          }
        });
      } else {
        callback(403, { error: 'Authentication failed' });
      }
    });
  } else {
    callback(400, {
      error: 'You have a problem in your request, please try again!!!',
    });
  }
};

module.exports = handler;
