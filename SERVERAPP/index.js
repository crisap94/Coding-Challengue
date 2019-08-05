"use strict";
exports.__esModule = true;
// server.js
var ws_1 = require("ws");
var listeningPort = 27877;
var wsReceive = new ws_1["default"].Server({ port: listeningPort });
var writingPort = 27878;
var wsSend = new ws_1["default"].Server({ port: writingPort });
var sum = 0;
var counter = 0;
var clientsSoscket = [];
var finalSum = [];
// ────────────────────────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────────────
wsReceive.on('connection', function (socket) {
    console.info("Client Connected on Receiving Socket");
    clientsSoscket.push(socket);
    socket.on('message', function (msg) {
        var payload = JSON.parse(String(msg));
        console.info(payload);
        if (payload.value < 0 || payload.value > 20) {
            socket.close();
        }
        else {
            sum += payload.value;
            counter++;
        }
    });
    socket.on('close', function () {
        console.log('closing connection');
    });
});
wsSend.on('connection', function (socket) {
    console.info("Client Connected on Sending Socket");
    socket.on('message', function (msg) {
        console.info("Receiving on Writing Socket " + msg);
    });
    socket.on('close', function () {
        console.log('closing connection');
    });
    setInterval(function () {
        if (sum != 0) {
            socket.send(sum);
            console.info(" Data/s " + counter);
            counter = 0;
            sum = 0;
        }
        //console.info(`Sum: ${sum}`);
    }, 1000);
});
