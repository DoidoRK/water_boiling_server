const WebSocket = require('ws');
const { MESSAGE_OP } = require('../types');
const { HOST, WS_STATUS_PORT } = require('../config');

const wsStatusSocket = new WebSocket.Server({ port: WS_STATUS_PORT }, () => {
    console.log(`WebSocket server listening on ${HOST}:${WS_STATUS_PORT}`);
});

wsStatusSocket.start = (eventEmitter) => {
    wsStatusSocket.on('connection', (ws) => {
        const wsClientAddress = ws.remoteAddress;
        console.log(`TCP Client connected: ${wsClientAddress}`);
        console.log('WebSocket client connected');

        ws.on('message', (data) => {
            console.log('Received data from client:', data.toString());
            const message = JSON.parse(data);

            switch (message.message_type) {

                case MESSAGE_OP.SYSTEM_STATUS:
                    // Handle system status update
                    break;

                default:
                    console.error('Unknown message type');
                    break;
            }

            const response = { status: 'success' };
            ws.send(JSON.stringify(response));
        });

        ws.on('close', () => {
            console.log('WebSocket client disconnected on status port');
        });
    });
};

module.exports = wsStatusSocket;