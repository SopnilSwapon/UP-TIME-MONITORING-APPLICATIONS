// dependencies

const url = require('url');
const { StringDecoder } = require('string_decoder');

// const routes = require('/handlers/sampleHandler.js');
const { sampleHandler } = require('../handlers/sampleHandler');
const { notFoundHandlers } = require('../handlers/notFoundHandlers');
const routes = require('../routes');
const { paseJSON } = require('../helpers/utilities');

// scaffolding
const handler = {};

handler.handleReqRes = (req, res) => {
  // request handling
  // get the path & parse it
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimPath = path.replace(/^\/+|\/+$/g, '');
  const method = req.method.toLowerCase();
  const queryStringObj = parsedUrl.query;
  const headersObject = req.headers;

  const requestProperties = {
    parsedUrl,
    path,
    trimPath,
    method,
    queryStringObj,
    headersObject,
  };
  const decoder = new StringDecoder('utf-8');
  let realData = '';
  const chosenHandler = routes[trimPath] ? routes[trimPath] : notFoundHandlers;

  req.on('data', (buffer) => {
    realData += decoder.write(buffer);
  });
  req.on('end', () => {
    realData += decoder.end();
    requestProperties.body = paseJSON(realData);
    chosenHandler(requestProperties, (statusCode, payload) => {
      statusCode = typeof statusCode === 'number' ? statusCode : 500;
      payload = typeof payload === 'object' ? payload : {};

      const payloadString = JSON.stringify(payload);
      // return the final response;
      res.setHeader('Content-type', 'application.json');
      res.writeHead(statusCode);
      res.end(payloadString);
    });
  });

  // response handle
};

module.exports = handler;
