const net = require('net');
const { MESSAGE_OP } = require('../types');
const { HOST, TCP_CMD_PORT } = require('../config');

const clients = new Set();

const tcpCmdSocket = net.createServer((socket) => {
  const tcpClientAddress = socket.remoteAddress;
  console.log(`TCP Command Socket new client connected: ${tcpClientAddress}`);

  clients.add(socket);

  socket.on('data', (data) => {
    console.log('TCP Command Socket Received data from client:', data.toString());
    const message = JSON.parse(data);
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


tcpCmdSocket.start = (eventEmitter) => {
    tcpCmdSocket.listen(TCP_CMD_PORT, HOST, () => {
        console.log(`TCP Command Socket listening on: ${HOST}:${TCP_CMD_PORT}`);
    });

    eventEmitter.on('message', (message) => {
        const data = JSON.stringify(message);
        console.log('Sending data to TCP clients:', data);
        clients.forEach((client) => {
            client.write(data);
        });
    });
};

module.exports = tcpCmdSocket;