var server = require('./server');

// start server on the specified port and binding host
server.express.listen(server.appEnv.port, '0.0.0.0', function () {
    // print a message when the server starts listening
    console.log("server starting on " + server.appEnv.url);
});
