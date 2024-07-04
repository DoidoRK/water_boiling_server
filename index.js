const net = require('net');
const os = require('os');
const WebSocket = require('ws');
const { MESSAGE_OP, MOCK_PARAMS } = require('./types');
const { TCP_PORT, WS_PORT } = require('./config');

var HOST = '0.0.0.0';
var ips = os.networkInterfaces();
Object
  .keys(ips)
  .forEach(function(_interface) {
     ips[_interface]
      .forEach(function(_dev) {
        if (_dev.family === 'IPv4' && !_dev.internal) HOST = _dev.address 
      }) 
  });

// Create WebSocket server
const wsServer = new WebSocket.Server({ port: WS_PORT }, () => {
    console.log(`WebSocket server listening on ${HOST}:${WS_PORT}`);
});

//Websocket Server
wsServer.on('connection', (ws) => {
    console.log('WebSocket client connected');
    const wsClientAddress = ws.remoteAddress;

    ws.on('data', (data) => {
        console.log(data)
        switch (data.message_type) {

            case MESSAGE_OP.CONNECTION_ATTEMPT:
                //new ESP trying to connect to server
                break;

            case MESSAGE_OP.SYSTEM_PARAM_CHANGE:
                //Frontend client wants to change system params
                //Answers with a success in case the ESP receives the update successfully
                //Answers with a fail in case the ESP fails to update.
                break;

            case MESSAGE_OP.SYSTEM_STARTUP:
                //Frontend client is saying the system configuration is done
                //Sends ack to front end client and Starts up system simulation in ESP32
                break;

            case MESSAGE_OP.SYSTEM_STATUS:
                //Incoming message from ESP updating the client about the simulation status.
                //Just reroutes the data to the front end client.                
                break;

            case MESSAGE_OP.SYSTEM_INTR:
                //Frontend client telling ESP32 to interrupt it's simulation.
                //(Closes all valves and turns off the resistance that heats up the water).                
                break;

            case MESSAGE_OP.SYSTEM_SHUTDOWN:
                //Frontend client saying the system must be shut down.
                //ESP32 empties both tanks in simulation and shuts down.                
                break;
        
            default:
                console.error('Unknwon message type.');
                break;
        }
        const response = { status: 'success'};
        socket.write(JSON.stringify(response));
    });

    ws.on('close', () => {
        console.log('WebSocket client disconnected');
    });
});

//TCP Server
const tcpServer = net.createServer((socket) => {
    // Log client connection with IP address
    const tcpClientAddress = socket.remoteAddress;
    console.log(`Client connected: ${tcpClientAddress}`);

    socket.on('data', (data) => {
        console.log('Received data from client:', data.toString());
        switch (data.message_type) {
            case MESSAGE_OP.CONNECTION_ATTEMPT:
                //new ESP trying to connect to server
                break;

            case MESSAGE_OP.SYSTEM_PARAM_CHANGE:
                //Frontend client wants to change system params
                //Answers with a success in case the ESP receives the update successfully
                //Answers with a fail in case the ESP fails to update.
                break;

            case MESSAGE_OP.SYSTEM_STARTUP:
                //Frontend client is saying the system configuration is done
                //Sends ack to front end client and Starts up system simulation in ESP32
                break;

            case MESSAGE_OP.SYSTEM_STATUS:
                //Incoming message from ESP updating the client about the simulation status.
                //Just reroutes the data to the front end client.                
                break;

            case MESSAGE_OP.SYSTEM_INTR:
                //Frontend client telling ESP32 to interrupt it's simulation.
                //(Closes all valves and turns off the resistance that heats up the water).                
                break;

            case MESSAGE_OP.SYSTEM_SHUTDOWN:
                //Frontend client saying the system must be shut down.
                //ESP32 empties both tanks in simulation and shuts down.                
                break;
        
            default:
                console.error('Unknwon message type.');
                break;
        }
        const response = { status: 'success'};
        socket.write(JSON.stringify(response));
    });

    socket.on('end', () => {
        console.log('Client disconnected');
    });

    socket.on('error', (err) => {
        console.error('Socket error:', err);
    });
});

tcpServer.listen(TCP_PORT, HOST, () => {
    console.log(`TCP Server listening on ${HOST}:${TCP_PORT}`);
});

// Handle shutdown
process.on('SIGINT', () => {
    console.log('Shutting down...');
    tcpServer.close(() => {
        wsServer.close(() => {
            console.log('WS server closed');
        })
        console.log('TCP server closed');
    });
});