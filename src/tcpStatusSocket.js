const net = require('net');
const { MESSAGE_OP } = require('../types');
const { HOST, TCP_STATUS_PORT } = require('../config');
const { statusEmitter } = require('./emitters');

const clients = new Set();

const tcpStatusSocket = net.createServer((socket) => {
    const tcpClientAddress = socket.remoteAddress;
    console.log(`TCP Status Socket Client connected: ${tcpClientAddress}`);

    socket.on('data', (data) => {
        console.log('TCP Status Socket received data:', data.toString());
        const message = JSON.parse(data);
        const response = { status: 'success' };
        socket.write(JSON.stringify(response));
        statusEmitter.emit('message', message);
    });

    socket.on('end', () => {
        console.log('TCP Status Socket Client disconnected');
        clients.delete(socket);
    });

    socket.on('error', (err) => {
        console.error('TCP Status Socket error:', err);
        clients.delete(socket);
    });
});

tcpStatusSocket.listen(TCP_STATUS_PORT, HOST, () => {
    console.log(`TCP Status Socket listening on ${HOST}:${TCP_STATUS_PORT}`);
});

module.exports = tcpStatusSocket;