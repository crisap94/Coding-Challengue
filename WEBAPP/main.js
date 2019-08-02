var data = 0;

var dataArray = [];
var timeArray = [];

var counter = 0;

var sendConnection = new WebSocket('ws://localhost:27877');

sendConnection.onopen = function () {
     console.info(`Open Connection on Listening Socket`)
};

// Log errors
sendConnection.onerror = function (error) {
     console.error('WebSocket to Send Random Data - Error ' + error);
};

// Log messages from the server
sendConnection.onmessage = function (e) {
     console.log('Message from server on Listening Socket', e.data);
};

function randomData() {
     return Math.floor(Math.random() * 20);
}

setInterval(() => {
     sendConnection.send(randomData());
}, 150)




var receiveConnection = new WebSocket('ws://localhost:27878');

receiveConnection.onopen = function () {
     console.info(`Open Connection on Receiving Socket`);
};

// Log errors
receiveConnection.onerror = function (error) {
     console.error('WebSocket to Send Random Data Error ' + error);
};

// Log messages from the server
receiveConnection.onmessage = function (e) {
     console.log('message from server on Listening Socket', e.data);
     data = e.data;

     dataArray.push(e.data);
     
};


var cnt = 0;
setInterval(function () {
     chart.update();

     data = 0;
     cnt++;
     if (cnt > 20) {
          dataArray.shift();
          timeArray.shift()
          timeArray.push(cnt);
     }else{
          timeArray.push(cnt);
     }

}, 1000);

var chart = new Chart(document.getElementById("line-chart"), {
     type: 'line',
     data: {
          labels: timeArray,
          datasets: [{
               data: dataArray,
               label: "Africa",
               borderColor: "#3e95cd",
               fill: false}
          ]
     },
     options: {
          title: {
               display: true,
               text: 'Connected Clients'
          }
     }
});
