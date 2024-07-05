const settings = require('./config');
const wsServer = require('./src/webSocketServer');
const tcpServer = require('./src/tcpServer');

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