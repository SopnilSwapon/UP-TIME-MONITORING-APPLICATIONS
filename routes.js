const { sampleHandler } = require('./handlers/sampleHandler');
const { userHandler } = require('./handlers/userHandler');
// where you import
const routes = {
  sample: sampleHandler,
  user: userHandler,
};

module.exports = routes;
