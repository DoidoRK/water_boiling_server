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

const systemCurrentParams = {
    'water_supply_volume':100,
    'boiling_tank_volume':100,
    'input_valve_flow_speed':150,
    'middle_valve_flow_speed':150,
    'output_valve_flow_speed':150,
    'target_temperature':70,
    'water_boiling_rate':150,
    'sensor_reading_timer':100,
    'water_tank_water_max_level':95,
    'water_tank_water_min_level':20,
    'boiling_tank_water_max_level':95,
    'boiling_tank_water_min_level':20,
}

module.exports = { HOST, TCP_STATUS_PORT, TCP_CMD_PORT, WS_STATUS_PORT, WS_CMD_PORT, systemCurrentParams };