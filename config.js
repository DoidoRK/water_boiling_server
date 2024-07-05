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

const TCP_PORT = 8080;
const WS_PORT = 8081;

module.exports = { HOST, TCP_PORT, WS_PORT };