// server.js
var Server = require('ws').Server;

var listeningPort = 27877;
var wsReceive = new Server({ port: listeningPort });

var writingPort = 27878; 
var wsSend = new Server({ port: writingPort });

var sum = 0;
var counter = 0;

wsReceive.on('connection', function (w) {

     console.info(`Client Connected on Receiving Socket`);

     w.on('message', function (msg) {
          if (parseInt(msg) == "NaN" || (parseInt(msg) < 0 && parseInt(msg) > 20)) {
               w.close();
          } else {
               sum += parseInt(msg);
               counter++;
          }

     });

     w.on('close', function () {
          console.log('closing connection');
     });

});

wsSend.on('connection', function (w) {

     console.info(`Client Connected on Sending Socket`);

     w.on('message', function (msg) {
          console.info(`Receiving on Writing Socket ${msg}`);
     });

     w.on('close', function () {
          console.log('closing connection');
     });

     setInterval(() => {
          if (sum != 0) {
               w.send(sum);
               console.info(` Data/s ${counter}`)
               counter = 0;
               sum = 0;
          }
          //console.info(`Sum: ${sum}`);
     }, 1000);

});


