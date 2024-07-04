const os = require('os');
const wsServer = require('./src/webSocketServer');
const tcpServer = require('./src/tcpServer');
let { HOST } = require('./config');

// Determine host IP address dynamically
var ips = os.networkInterfaces();
Object.keys(ips).forEach((_interface) => {
    ips[_interface].forEach((_dev) => {
        if (_dev.family === 'IPv4' && !_dev.internal){
            HOST = _dev.address;
        }
    });
});

// Handle shutdown
process.on('SIGINT', () => {
    console.log('Shutting down...');
    tcpServer.close(() => {
        wsServer.close(() => {
            console.log('WS server closed');
        });
        console.log('TCP server closed');
    });
});