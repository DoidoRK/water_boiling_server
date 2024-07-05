const os = require('os');

let HOST = '0.0.0.0';

// Determine host IP address dynamically
var ips = os.networkInterfaces();
Object.keys(ips).forEach((_interface) => {
    ips[_interface].forEach((_dev) => {
        if (_dev.family === 'IPv4' && !_dev.internal){
            HOST = _dev.address;
        }
    });
});

const TCP_STATUS_PORT = 8080;
const TCP_CMD_PORT = 8081;
const WS_STATUS_PORT = 8082;
const WS_CMD_PORT = 8083;

module.exports = { HOST, TCP_STATUS_PORT, TCP_CMD_PORT, WS_STATUS_PORT, WS_CMD_PORT };