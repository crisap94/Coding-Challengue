var data = 0;


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
};



Plotly.plot('chart', [{
     y: [data],
     type: 'line'
}]);


var cnt = 0;
setInterval(function () {
     Plotly.extendTraces('chart', { y: [[data]] }, [0]);
     data = 0;
     cnt++;
     if (cnt > 200) {
          Plotly.relayout('chart', {
               xaxis: {
                    range: [cnt - 200, cnt]
               }
          });
     }
}, 1000);