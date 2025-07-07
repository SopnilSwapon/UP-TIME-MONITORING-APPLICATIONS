// UP-TIME-MONITORING-APPLICATIONS

// dependencies

const http = require('http');

const x = 5;

const { handleReqRes } = require('./helpers/handleReqRes');
const environments = require('./helpers/environments');
const data = require('./lib/data');

// app object - module scaffolding
const app = {};

data.create(
  'test',
  'newFile',
  { name: 'Bangladesh', language: 'Bengali' },
  (err) => {
    console.log(`The error was ${err}`);
  }
);
// create server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(environments.port, () => {
    console.log(`environment is ${process.env.NODE_ENV}`);
    console.log(`listing to  port ${environments.port}`);
  });
};

app.handleReqRes = handleReqRes;

app.createServer();
