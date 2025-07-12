const { sampleHandler } = require('./handlers/sampleHandler');
const { userHandler } = require('./handlers/userHandler');
const { tokenHandler } = require('./handlers/tokenHandler');
// where you import
const routes = {
  sample: sampleHandler,
  user: userHandler,
  token: tokenHandler,
};

module.exports = routes;
