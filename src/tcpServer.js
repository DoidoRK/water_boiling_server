const net = require('net');
const { MESSAGE_OP } = require('../types');
const { HOST, TCP_PORT } = require('../config');

const tcpServer = net.createServer((socket) => {
    const tcpClientAddress = socket.remoteAddress;
    console.log(`Client connected: ${tcpClientAddress}`);

    socket.on('data', (data) => {
        console.log('Received data from client:', data.toString());
        const message = JSON.parse(data);

        switch (message.message_type) {
            case MESSAGE_OP.CONNECTION_ATTEMPT:
                // Handle connection attempt
                break;

            case MESSAGE_OP.SYSTEM_PARAM_CHANGE:
                // Handle system param change
                break;

            case MESSAGE_OP.SYSTEM_STARTUP:
                // Handle system startup
                break;

            case MESSAGE_OP.SYSTEM_STATUS:
                // Handle system status update
                break;

            case MESSAGE_OP.SYSTEM_INTR:
                // Handle system interrupt
                break;

            case MESSAGE_OP.SYSTEM_SHUTDOWN:
                // Handle system shutdown
                break;

            default:
                console.error('Unknown message type');
                break;
        }

        const response = { status: 'success' };
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

module.exports = tcpServer;
