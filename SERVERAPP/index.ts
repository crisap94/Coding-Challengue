// server.js
import * as WebSocket from "ws"

var listeningPort = 27877;
var wsReceive = new WebSocket.Server({ port: listeningPort });

var writingPort = 27878;
var wsSend = new WebSocket.Server({ port: writingPort });

let clients: clientSchema[] = [];

let previusClientData: clientsRandomData[] = [];

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



wsReceive.on('connection', (socket) => {

     console.info(`Client Connected on Receiving Socket`);

     socket.on('message', (msg) => {

          var payload: clientsRandomData = JSON.parse(String(msg))

          //console.info(payload);

          if (payload.value < 0 || payload.value > 20) {
               console.info(`Client ${payload.id} exceeded data range`);
               console.info(`Closing Connection`);
               socket.close();
          } else {
               if (!clientExist(payload)) {
                    addClient(payload, socket);
               } else {
                    findClient(payload).data.value += payload.value;
                    updatePreviusValue(payload)
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
          for (let index = 0; index < clients.length; index++) {
               const client = clients[index];
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
     console.info(`Adding New Client ${client.id}`);
     clients.push({
          data: client,
          socket: newSocket
     });

     previusClientData.push({
          id: client.id,
          value: client.value
     })
}


function cleanClientsValues() {
     clients.forEach(client => {
          client.data.value = 0;
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
