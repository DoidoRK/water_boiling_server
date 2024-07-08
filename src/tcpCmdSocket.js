const net = require('net');
const { MESSAGE_OP } = require('../types');
const { HOST, TCP_CMD_PORT, systemCurrentParams } = require('../config');
const { cmdEmitter } = require('./emitters');

const clients = new Set();

const tcpCmdSocket = net.createServer((socket) => {
  const tcpClientAddress = socket.remoteAddress;
  console.log(`TCP Command Socket new client connected: ${tcpClientAddress}`);
  socket.write(JSON.stringify({
    'message_type':1,
    'system_settings':systemCurrentParams,
  }));

  clients.add(socket);

  socket.on('data', (data) => {
    console.log('TCP Command Socket Received data from client:', data.toString());    
    const response = { status: 'success' };
    socket.write(JSON.stringify(response));
  });

  socket.on('end', () => {
    console.log('TCP Command Socket Client disconnected');
    clients.delete(socket);
  });

  socket.on('error', (err) => {
    console.error('TCP Command Socket error:', err);
    clients.delete(socket);
  });
});


tcpCmdSocket.listen(TCP_CMD_PORT, HOST, () => {
    console.log(`TCP Command Socket listening on: ${HOST}:${TCP_CMD_PORT}`);
});

cmdEmitter.on('message', (message) => {
    const data = JSON.stringify(message);
    console.log('Sending data to TCP clients:', data);
    clients.forEach((client) => {
        client.write(data);
    });
});

module.exports = tcpCmdSocket;