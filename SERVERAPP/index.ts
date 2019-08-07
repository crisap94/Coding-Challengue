// server.js

//
// ────────────────────────────────────────────────────── I ──────────
//   :::::: I M P O R T S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────
//


import * as WebSocket from "ws";

//
// ────────────────────────────────────────────────────────────────────────── II ──────────
//   :::::: W E B S O C K E T   I N S T A N C E S : :  :   :    :     :        :          :
// ────────────────────────────────────────────────────────────────────────────────────────
//


var listeningPort = 27877;
var wsReceive = new WebSocket.Server({ port: listeningPort });

var writingPort = 27878;
var wsSend = new WebSocket.Server({ port: writingPort });

let clients: clientSchema[] = [];

let previusClientData: clientsRandomData[] = [];


// ────────────────────────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────────────


//
// ─── TYPES ──────────────────────────────────────────────────────────────────────
//

type clientsRandomData = {
     id: string,
     value: number
};

type clientSchema = {
     data: clientsRandomData,
     socket: WebSocket
};
// ────────────────────────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────────────


/**
 * * Function in charge of handling the incoming connection
 */
wsReceive.on('connection', (socket) => {

     console.info(`Client Connected on Receiving Socket`);

     /**
      * * In charge of handling the incoming messages
      */
     socket.on('message', (msg) => {

          var payload: clientsRandomData = JSON.parse(String(msg))

          //console.info(payload);

          /**
           * ? Validate the Data
           * 
           */
          if (payload.value < 0 || payload.value > 20) {
               console.info(`Client ${payload.id} exceeded data range`);
               console.info(`Closing Connection`);
               socket.close();
          } else {
               if (!clientExist(payload)) {
                    addClient(payload, socket);
               } else {
                    findClient(payload).data.value += payload.value;
               }
          }

     });

     socket.on('close', () => {
          console.log('closing connection');

     }); 

});

wsSend.on('connection', function (socket) {

     console.info(`Client Connected on Sending Socket`);

     socket.on('close', () => {
          console.log('closing connection');
     }); 

     setInterval(() => {
          console.info(`Clients: ${clients.length}`);
          for (let index = 0; index < clients.length; index++) {
               const client = clients[index];
               console.log(client.data);
          }
          for (let index = 0; index < clients.length; index++) {
               const client = clients[index];
               updatePreviusValue(clients[index].data)
               socket.send(JSON.stringify(clients[index].data));
          }
          cleanClientsValues();
     }, 1000);

});

function clientExist(json: clientsRandomData) {
     let exist: boolean = false;

     for (let index = 0; index < clients.length; index++) {

          const client: clientSchema = clients[index];

          if (json.id == client.data.id) {
               exist = true;
               break;
          }
     }

     //console.info(`Client ${exist ? "exist" : "doen't exist"}`);

     return exist;
}

setInterval(() => {// * Remove Client after 5 Seconds
     for (let index = 0; index < clients.length; index++) {
          const client = clients[index];
          if (client.data.value == previusClientData[index].value) {
               clients.splice(index, 1);
               previusClientData.splice(index, 1);
          }
     }
}, 1000)

function addClient(client: clientsRandomData, newSocket: WebSocket) {
     //console.info(`Adding New Client ${client.id}`);
     clients.push({
          data: client,
          socket: newSocket
     });

     previusClientData.push(client)
}


function cleanClientsValues() {
     clients.forEach(client => {
          if (client.data.value>100){
               client.data.value = 0;
          }
     });
}

function findClient(client: clientsRandomData): clientSchema {
     for (let index = 0; index < clients.length; index++) {
          const tempClient = clients[index];
          if (tempClient.data.id == client.id) {
               //console.info(`Client Founded ${client.id}`)
               return clients[index];
          }
     }
}

function updatePreviusValue(client: clientsRandomData) {
     for (let index = 0; index < clients.length; index++) {
          const tempClient = clients[index];
          if (tempClient.data.id == client.id) {
               //console.info(`Client previus value Updated ${client.id}`)
               previusClientData[index].value = client.value;
               break;
          }
     }
}
