

let timeArray = [];

let MyID:string = generateID();

let clients: clientSchema[] = []

let datasets: dataset[]= [];

var counter = 0;

const SENDING_SOCKET_URL = 'ws://localhost:27877';
const RECEIVING_SOCKET_URL = 'ws://localhost:27878';

var sendConnection = new WebSocket(SENDING_SOCKET_URL);

var receiveConnection = new WebSocket(RECEIVING_SOCKET_URL);

var canvas = document.getElementById("line-chart") as HTMLCanvasElement

var ctx = canvas.getContext('2d');

var chart = new Chart(ctx, {
     type: 'line',
     data: {
          labels: timeArray,
          datasets: datasets
     },
     options: {
          title: {
               display: true,
               text: 'Connected Clients'
          }
     }
});


//
// ─── TYPES ──────────────────────────────────────────────────────────────────────
//


type dataset = {
     label: string,
     data: number[],
     borderColor: string,
     fill: boolean
};

type clientsRandomData = {
     id: string,
     value: number
}

type clientSchema = {
     id: string,
     lastEntry:number,
     dataset: dataset
};

// ────────────────────────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────────────



//
// ──────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: S E N D I N G   S O C K E T   F U N C T I O N S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────────────────
//


sendConnection.onopen = function () {
     console.info(`Open Connection on Listening Socket`)
};

// Log errors
sendConnection.onerror = function (error) {
     console.error('WebSocket to Send Random Data - Error ' + error);
};

function randomData() {
     return Math.floor(Math.random() * 20);
}

setInterval(() => {

     let payload:clientsRandomData = {
          id: MyID,
          value:randomData()
     }

     if(sendConnection.readyState == WebSocket.OPEN){

          sendConnection.send(JSON.stringify(payload));

     }else if(sendConnection.readyState == WebSocket.CLOSED){
          console.info(`Attempting to connect to server`);
          sendConnection = new WebSocket(SENDING_SOCKET_URL);
     }

     if (receiveConnection.readyState == WebSocket.CLOSED) {
          console.info(`Attempting to connect to server`);
          receiveConnection = new WebSocket(RECEIVING_SOCKET_URL);
     }

}, 150)


// ────────────────────────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────────────



//
// ──────────────────────────────────────────────────────────────────────────────────────────── II ──────────
//   :::::: R E C E I V I N G   S O C K E T   F U N C T I O N S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────────────────────
//


receiveConnection.onopen = function () {
     console.info(`Open Connection on Receiving Socket`);
};

// Log errors
receiveConnection.onerror = function (error) {
     console.error('WebSocket to Send Random Data Error ' + error);
};

// Log messages from the server
receiveConnection.onmessage = function (e) {
     console.log(e.data);
     if (checkJsonType(e.data)) {
          let data: clientsRandomData = JSON.parse(e.data);
          if (!clientExist(data)) {
               addClient(data);
          }else{
               let client:clientSchema = findClient(data);
               client.lastEntry = Date.now();
               client.dataset.data.push(data.value);
               console.log(client.dataset)
          }
     }
};

// ────────────────────────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────────────


function checkJsonType(payload: string): boolean {
     try {
          let json: clientsRandomData = JSON.parse(payload);
          return true;
     } catch (e) {
          console.info(`Error casting data ${e}`);
          return false;
     }
}

function clientExist(json: clientsRandomData) {
     let exist: boolean = false;

     for (let index = 0; index < clients.length; index++) {

          const client: clientSchema = clients[index];

          if (json.id == client.id) {
               exist = true;
               break;
          }
     }

     return exist;
}


function addClient(newClient: clientsRandomData) {
     clients.push({
          id: newClient.id,
          lastEntry: Date.now(),
          dataset: {
               borderColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
               data: [newClient.value],
               label: `Client ${clients.length}`,
               fill: false
          }
     })
}

function removeClientAfter5Secs(){

     for (let index = 0; index < clients.length; index++) {
          const client:clientSchema = clients[index];
          if(Date.now() - client.lastEntry > 5000){
               clients.splice(index,1);
          }
     }
}

function rebuildDatasets(){
     datasets = [];
     for (let index = 0; index < clients.length; index++) {
          const client:clientSchema = clients[index];
          datasets[index] = client.dataset;
     }
}

function findClient(data:clientsRandomData):clientSchema{
     for (let index = 0; index < clients.length; index++) {
          const client = clients[index];
          if (data.id == client.id) {
               return client;
          }
     }
}

function shiftAllClientsData(){
     for (let index = 0; index < clients.length; index++) {
          const client = clients[index];
          client.dataset.data.shift();
     }
}

/* setInterval(()=>{
     for (let index = 0; index < clients.length; index++) {
          const client = clients[index];
          if(client.dataset.data.length < timeArray.length){
               if (client.dataset.borderColor != "#FF0000"){
                    client.dataset.borderColor = `#FF0000`;
               }
          }
     }
},100) */

// ────────────────────────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────────────


//
// ─── UPDATE CHART ───────────────────────────────────────────────────────────────
//

var cnt = 0;
setInterval(() => {

     cnt++;

     //rebuildDatasets();
     
     timeArray.push(cnt);

     if (cnt > 20) {
          timeArray.shift()
          shiftAllClientsData();
     }


     removeClientAfter5Secs();

     chart.update();

}, 1000);

// ────────────────────────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────────────


//
// ─── MISCELANEUS ────────────────────────────────────────────────────────────────
//

function generateID():string {
     // Math.random should be unique because of its seeding algorithm.
     // Convert it to base 36 (numbers + letters), and grab the first 9 characters
     // after the decimal.
     return '_' + Math.random().toString(36).substr(2, 9);
};

