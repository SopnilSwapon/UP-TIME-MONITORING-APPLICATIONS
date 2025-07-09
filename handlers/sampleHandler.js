const handle = {};

handle.sampleHandler = (requestProperties, callback) => {
  console.log(requestProperties, 'check requesproperties');
  callback(200, { message: 'This is a sample url' });
};

module.exports = handle;
// const sampleHandler = {};

// sampleHandler.sample = (requestProperties, callback) => {
//   console.log(requestProperties, 'check requestProperties');
//   callback(200, { message: 'This is a sample url' });
// };

// module.exports = { sampleHandler };
