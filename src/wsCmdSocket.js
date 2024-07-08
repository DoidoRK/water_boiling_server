const WebSocket = require('ws');
const { MESSAGE_OP } = require('../types');
const { HOST, WS_CMD_PORT } = require('../config');
const { cmdEmitter } = require('./emitters');

const wsCmdSocket = new WebSocket.Server({ port: WS_CMD_PORT }, () => {
    console.log(`WS Command Socket listening on ${HOST}:${WS_CMD_PORT}`);
});

wsCmdSocket.on('connection', (ws) => {
    const wsClientAddress = ws.remoteAddress;
    console.log(`WS Command Socket new client connected: ${wsClientAddress}`);

    ws.on('message', (data) => {
        console.log('WS Command Socket received data from client:', data.toString());
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
                cmdEmitter.emit('message', message);
                break;

            case MESSAGE_OP.SYSTEM_INTR:
                // Handle system interrupt
                break;

            case MESSAGE_OP.SYSTEM_SHUTDOWN:
                cmdEmitter.emit('message', message);
                break;

            default:
                console.error('Unknown message type');
                break;
        }

        const response = { status: 'success' };
        ws.send(JSON.stringify(response));
    });

    ws.on('close', () => {
        console.log('WS Command Socket client disconnected');
    });
});

module.exports = wsCmdSocket;