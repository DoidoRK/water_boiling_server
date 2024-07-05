const WebSocket = require('ws');
const { MESSAGE_OP } = require('../types');
const { HOST, WS_PORT } = require('../config');

const wsServer = new WebSocket.Server({ port: WS_PORT }, () => {
    console.log(`WebSocket server listening on ${HOST}:${WS_PORT}`);
});

wsServer.start = (eventEmitter) => {
    wsServer.on('connection', (ws) => {
        const wsClientAddress = ws.remoteAddress;
        console.log(`TCP Client connected: ${wsClientAddress}`);
        console.log('WebSocket client connected');

        ws.on('message', (data) => {
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
                    // Forward message to TCP server
                    eventEmitter.emit('message', message);
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
            ws.send(JSON.stringify(response));
        });

        ws.on('close', () => {
            console.log('WebSocket client disconnected');
        });
    });
};

module.exports = wsServer;