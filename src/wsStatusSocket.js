const WebSocket = require('ws');
const { MESSAGE_OP } = require('../types');
const { HOST, WS_STATUS_PORT } = require('../config');
const { statusEmitter } = require('./emitters');

const wsStatusSocket = new WebSocket.Server({ port: WS_STATUS_PORT }, () => {
    console.log(`WS Status Socket listening on ${HOST}:${WS_STATUS_PORT}`);
});

wsStatusSocket.on('connection', (ws) => {
    const wsClientAddress = ws.remoteAddress;
    console.log(`WS Status Socket new client connected: ${wsClientAddress}`);

    ws.on('message', (data) => {
        console.log('WS Status Socket received data from client:', data.toString());
        const message = JSON.parse(data);

        switch (message.message_type) {
            case MESSAGE_OP.SYSTEM_STATUS:
                
                break;

            default:
                console.error('Unknown message type');
                break;
        }

        const response = { status: 'success' };
        ws.send(JSON.stringify(response));
    });

    ws.on('close', () => {
        console.log('WS Status Socket client disconnected');
    });
});

statusEmitter.on('message', (message) => {
    wsStatusSocket.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
});

module.exports = wsStatusSocket;