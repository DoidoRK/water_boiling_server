const WebSocket = require('ws');
const { MESSAGE_OP } = require('../types');
const { HOST, WS_CMD_PORT, systemCurrentParams } = require('../config');
const { cmdEmitter } = require('./emitters');

const wsCmdSocket = new WebSocket.Server({ port: WS_CMD_PORT }, () => {
    console.log(`WS Command Socket listening on ${HOST}:${WS_CMD_PORT}`);
});

wsCmdSocket.on('connection', (ws) => {
    const wsClientAddress = ws.remoteAddress;
    console.log(`WS Command Socket new client connected: ${wsClientAddress}`);
    ws.send(JSON.stringify(systemCurrentParams));

    ws.on('message', (data) => {
        console.log('WS Command Socket received data from client:', data.toString());
        const message = JSON.parse(data);

        switch (message.message_type) {
            case MESSAGE_OP.SYSTEM_STARTUP:
                // Forward message to TCP server
                cmdEmitter.emit('message', message);
                break;

            case MESSAGE_OP.SYSTEM_PARAM_CHANGE:
                // Handle system param change
                systemCurrentParams.input_valve_flow_speed = message.system_settings.input_valve_flow_speed;
                systemCurrentParams.middle_valve_flow_speed = message.system_settings.middle_valve_flow_speed;
                systemCurrentParams.output_valve_flow_speed = message.system_settings.output_valve_flow_speed;
                systemCurrentParams.target_temperature = message.system_settings.target_temperature;
                systemCurrentParams.water_boiling_rate = message.system_settings.water_boiling_rate;
                systemCurrentParams.sensor_reading_timer = message.system_settings.sensor_reading_timer;
                systemCurrentParams.water_tank_water_max_level = message.system_settings.water_tank_water_max_level;
                systemCurrentParams.water_tank_water_min_level = message.system_settings.water_tank_water_min_level;
                systemCurrentParams.boiling_tank_water_max_level = message.system_settings.boiling_tank_water_max_level;
                systemCurrentParams.boiling_tank_water_min_level = message.system_settings.boiling_tank_water_min_level;
                cmdEmitter.emit('message', message);
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