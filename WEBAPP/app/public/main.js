var timeArray = [];
var MyID = generateID();
var clients = [];
var datasets = [];
var counter = 0;
var SENDING_SOCKET_URL = 'ws://localhost:27877';
var RECEIVING_SOCKET_URL = 'ws://localhost:27878';
var sendConnection = new WebSocket(SENDING_SOCKET_URL);
var receiveConnection = new WebSocket(RECEIVING_SOCKET_URL);
var canvas = document.getElementById("line-chart");
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
// ────────────────────────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────────────
//
// ──────────────────────────────────────────────────────────────────────────────────────── I ──────────
//   :::::: S E N D I N G   S O C K E T   F U N C T I O N S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────────────────
//
sendConnection.onopen = function () {
    console.info("Open Connection on Listening Socket");
};
// Log errors
sendConnection.onerror = function (error) {
    console.error('WebSocket to Send Random Data - Error ' + error);
};
function randomData() {
    return Math.floor(Math.random() * 20);
}
setInterval(function () {
    var payload = {
        id: MyID,
        value: randomData()
    };
    if (sendConnection.readyState == WebSocket.OPEN) {
        sendConnection.send(JSON.stringify(payload));
    }
    else if (sendConnection.readyState == WebSocket.CLOSED) {
        console.info("Attempting to connect to server");
        sendConnection = new WebSocket(SENDING_SOCKET_URL);
    }
    if (receiveConnection.readyState == WebSocket.CLOSED) {
        console.info("Attempting to connect to server");
        receiveConnection = new WebSocket(SENDING_SOCKET_URL);
    }
}, 150);
// ────────────────────────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────────────
//
// ──────────────────────────────────────────────────────────────────────────────────────────── II ──────────
//   :::::: R E C E I V I N G   S O C K E T   F U N C T I O N S : :  :   :    :     :        :          :
// ──────────────────────────────────────────────────────────────────────────────────────────────────────
//
receiveConnection.onopen = function () {
    console.info("Open Connection on Receiving Socket");
};
// Log errors
receiveConnection.onerror = function (error) {
    console.error('WebSocket to Send Random Data Error ' + error);
};
// Log messages from the server
receiveConnection.onmessage = function (e) {
    console.log(e.data);
    if (checkJsonType(e.data)) {
        var data = JSON.parse(e.data);
        if (!clientExist(data)) {
            addClient(data);
        }
        else {
            var client = findClient(data);
            client.dataset.data.push(data.value);
            datasets.push(client.dataset);
        }
    }
};
function checkJsonType(payload) {
    try {
        var json = JSON.parse(payload);
        return true;
    }
    catch (e) {
        console.info("Error casting data " + e);
        return false;
    }
}
function clientExist(json) {
    var exist = false;
    for (var index = 0; index < clients.length; index++) {
        var client = clients[index];
        if (json.id == client.id) {
            exist = true;
            break;
        }
    }
    return exist;
}
function addClient(newClient) {
    clients.push({
        id: newClient.id,
        lastEntry: Date.now(),
        dataset: {
            borderColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
            data: [],
            label: "Client " + clients.length,
            fill: false
        }
    });
}
function removeClientAfter5Secs() {
    for (var index = 0; index < clients.length; index++) {
        var client = clients[index];
        if (Date.now() - client.lastEntry > 5000) {
            clients.splice(index, 1);
        }
    }
}
function rebuildDatasets() {
    datasets = [];
    for (var index = 0; index < clients.length; index++) {
        var client = clients[index];
        datasets.push(client.dataset);
    }
}
function findClient(data) {
    for (var index = 0; index < clients.length; index++) {
        var client = clients[index];
        if (data.id == client.id) {
            return client;
        }
    }
}
function shiftAllClientsData() {
    for (var index = 0; index < clients.length; index++) {
        var client = clients[index];
        client.dataset.data.shift();
    }
}
setInterval(function () {
    for (var index = 0; index < clients.length; index++) {
        var client = clients[index];
        if (client.dataset.data.length < timeArray.length) {
            if (client.dataset.borderColor != "#FF0000") {
                client.dataset.borderColor = "#FF0000";
            }
        }
    }
}, 100);
// ────────────────────────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────────────
//
// ─── UPDATE CHART ───────────────────────────────────────────────────────────────
//
var cnt = 0;
setInterval(function () {
    cnt++;
    rebuildDatasets();
    if (cnt > 20) {
        timeArray.shift();
        shiftAllClientsData();
    }
    timeArray.push(cnt);
    removeClientAfter5Secs();
    chart.update();
}, 1000);
// ────────────────────────────────────────────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────────────
//
// ─── MISCELANEUS ────────────────────────────────────────────────────────────────
//
function generateID() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
}
;
