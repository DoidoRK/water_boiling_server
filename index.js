const net = require('net');
const os = require('os');
const { MESSAGE_OP, MOCK_PARAMS } = require('./types');
const { MAX_CLIENTS } = require('./config');

const PORT = 8080;

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

// Map to store connected clients with their IP addresses
const connectedClients = new Map();


const server = net.createServer((socket) => {
    // Log client connection with IP address
    const clientAddress = socket.remoteAddress;
    console.log(`Client connected: ${clientAddress}`);

    socket.on('data', (data) => {
        console.log('Received data from client:', data.toString());
        switch (data.message_type) {
            case CONNECTION_ATTEMPT:
                //new client trying to connect to server
                // Check if maximum number of clients is reached
                if (connectedClients.size >= MAX_CLIENTS && connectedClients.has(clientAddress)) {
                    console.log('Max clients reached. Rejecting connection.');
                    socket.destroy();
                    return;
                }

                // Store client IP in the Map
                connectedClients.set(socket, clientAddress);

                //Gets this client data and saves it as current user
                //If answers with a SERVER_CONNECTION_STABLISHED to tell the client it can control the system
                
                break;

            case SYSTEM_PARAM_CHANGE:
                //Frontend client wants to change system params
                //Answers with a success in case the ESP receives the update successfully
                //Answers with a fail in case the ESP fails to update.
                
                break;

            case SYSTEM_STARTUP:
                //Frontend client is saying the system configuration is done
                //Sends ack to front end client and Starts up system simulation in ESP32
                break;

            case SYSTEM_STATUS:
                //Incoming message from ESP updating the client about the simulation status.
                //Just reroutes the data to the front end client.                
                break;

            case SYSTEM_INTR:
                //Frontend client telling ESP32 to interrupt it's simulation.
                //(Closes all valves and turns off the resistance that heats up the water).                
                break;

            case SYSTEM_SHUTDOWN:
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

server.listen(PORT, HOST, () => {
    console.log(`Server listening on ${HOST}:${PORT}`);
});
