/**
 * Created by logov on 04-Jan-17.
 */

module.exports = function(httpServer) {
    var WebSocketServer = require('websocket').server,
        wss = new WebSocketServer({
            httpServer: httpServer
        });

    httpServer.on('upgrade', wss.handleUpgrade);
    wss.on('request', function (request) {
        var connection = request.accept(null, request.origin);

        connection.on('message', function (message) {
            connection.send('Reply for message: "' + message + '"')
        });
    });

    return wss;
};
