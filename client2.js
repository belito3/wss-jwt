// Client without token

var config = require('./config');
var WebSocket = require('ws');

var ws = new WebSocket(config.SIGNALING_URL);

ws.on('open', function open() {
    ws.send('message from client 2');
})

ws.on('message', function incomming(data) {
    console.log(data);
})