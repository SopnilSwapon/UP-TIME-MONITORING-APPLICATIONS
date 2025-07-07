// UP-TIME-MONITORING-APPLICATIONS

// dependencies

const http = require('http');

const { handleReqRes } = require('./helpers/handleReqRes');
const environments = require('./helpers/environments');
const data = require('./lib/data');

// app object - module scaffolding
const app = {};

data.delete('test', 'newFile', (err) => {
  console.log(err);
});
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
