const EventEmitter = require('events');

const cmdEmitter = new EventEmitter();
const statusEmitter = new EventEmitter();

module.exports = {statusEmitter, cmdEmitter};
