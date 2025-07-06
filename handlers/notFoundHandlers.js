const handle = {};
 handle.notFoundHandlers = (requestProperties, callback) => {
    callback(404, {message: "your requested url is not found"})
    console.log("not found", requestProperties)
}

module.exports = handle;