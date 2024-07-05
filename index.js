const settings = require('./config');
const tcpCmdSocket = require('./src/tcpCmdSocket')
const tcpStatusSocket = require('./src/tcpStatusSocket');
const wsCmdSocket = require('./src/wsCmdSocket')
const { EventEmitter } = require('events');

const WStoTCPEmitter = new EventEmitter();  //Front to Back comms
wsCmdSocket.start(WStoTCPEmitter);
tcpCmdSocket.start(WStoTCPEmitter);

