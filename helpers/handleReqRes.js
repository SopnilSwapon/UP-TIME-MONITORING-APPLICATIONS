// dependencies 

const url = require('url');
const {StringDecoder} = require('string_decoder');

// const routes = require('/handlers/sampleHandler.js');
const {sampleHandler} = require('../handlers/sampleHandler');
const {notFoundHandlers} = require("../handlers/notFoundHandlers")

// scaffolding
const handler = {}

handler.handleReqRes = (req, res) => {
      // request handling 
    // get the path & parse it
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toUpperCase();
    const queryStringObj = parsedUrl.query;
    const headersObject = req.headers;
    
    const requestProperties = {
        parsedUrl, path, trimPath, method, queryStringObj, headersObject
    }
    const decoder = new StringDecoder("utf-8");
    let realData = "";
    console.log(sampleHandler[trimPath], 'check the trim')
    const chosenHandler = sampleHandler[trimPath] ? sampleHandler[trimPath] : notFoundHandlers;
   

    req.on("data", (buffer) => {
        realData += decoder.write(buffer);

    });
    req.on("end", () => {
        realData += decoder.end();
        chosenHandler(requestProperties, (statusCode, payload) => {
            statusCode = typeof(statusCode) === "number" ? statusCode : 500;
            payload = typeof(payload) === "object" ? payload : {};
    
            const payloadString = JSON.stringify(payload);
            // return the final response;
    
            res.writeHead(statusCode);
            res.end(payloadString)
        })
        res.end("hello backend developers I'm coming withing 2 months or 3 months or max 6 months");

    })

    console.log(trimPath, 'check url', method, "check query", queryStringObj, "check headers", headersObject)
    
    // response handle
  
}

module.exports = handler;
