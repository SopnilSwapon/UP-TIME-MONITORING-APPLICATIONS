const handler = {};
handler._user = {};

handler.userHandler = (requestProperties, callback) => {
  const acceptedMethods = ['get', 'post', 'put', 'delete'];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._user[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handler._user.post = (requestProperties, callback) => {};
handler._user.get = (requestProperties, callback) => {
  callback(200, { message: 'right way' });
};
handler._user.put = (requestProperties, callback) => {};
handler._user.delete = (requestProperties, callback) => {};

module.exports = handler;
