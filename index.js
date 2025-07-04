// UP-TIME-MONITORING-APPLICATIONS

// dependencies

const http = require("http");
const url = require('url');
const {StringDecoder} = require('string_decoder')
// app object - module scaffolding
const app = {};
// configuration
app.config = {
    port: 3000
}
// create server 
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, () => {
        console.log(`listing to  port ${app.config.port}`)
    }) ;
}

app.handleReqRes = (req, res) => {
      // request handling 
    // get the path & parse it
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toUpperCase();
    const queryStringObj = parsedUrl.query;
    const headersObject = req.headers;

    const decoder = new StringDecoder("utf-8");
    let realData = "";

    req.on("data", (buffer) => {
        realData += decoder.write(buffer);

    });
    req.on("end", () => {
        realData += decoder.end();

        console.log(realData, 'check out real data');
        res.end("hello backend developers I'm coming withing 2 months or 3 months or max 6 months");

    })

    console.log(trimPath, 'check url', method, "check query", queryStringObj, "check headers", headersObject)
    
    // response handle
  
}

app.createServer();


