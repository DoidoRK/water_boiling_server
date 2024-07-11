const WebSocket = require('ws');
const { MESSAGE_OP } = require('../types');
const { HOST, WS_CMD_PORT, systemCurrentParams } = require('../config');
const { cmdEmitter } = require('./emitters');

let clients = [];
let hasOwner = false;
let isRunning = false;

function generateUniqueId() {
    return Math.random().toString(36).slice(2,9);
}

const wsCmdSocket = new WebSocket.Server({ port: WS_CMD_PORT }, () => {
    console.log(`WS Command Socket listening on ${HOST}:${WS_CMD_PORT}`);
});

wsCmdSocket.on('connection', (ws) => {
    ws.clientId = generateUniqueId();
    if(!hasOwner){
        hasOwner = true;
        ws.isOwner = true;
        ws.send(JSON.stringify({ hasOwner: false, isRunning: isRunning }));
    } else {
        ws.isOwner = false;
        ws.send(JSON.stringify({ hasOwner: true,  isRunning: isRunning }));
    }
    console.log(`WS Command Socket new client connected: ${ws.clientId}`);
    clients.push(ws);
    ws.send(JSON.stringify({systemParams: systemCurrentParams}));

    ws.on('message', (data) => {
        console.log('WS Command Socket received data from client:', data.toString());
        const message = JSON.parse(data);

        switch (message.message_type) {
            case MESSAGE_OP.SYSTEM_STARTUP:
                // Forward message to TCP server
                cmdEmitter.emit('message', message);
                isRunning = true;
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
                clients.forEach((client)=>{
                    if(!client.isOwner){
                        client.send(JSON.stringify({systemParams: systemCurrentParams}))
                    }
                })
                break;

            case MESSAGE_OP.SYSTEM_SHUTDOWN:
                cmdEmitter.emit('message', message);
                isRunning = false;
                break;

            default:
                console.error('Unknown message type');
                break;
        }

        ws.send(JSON.stringify({ status: 'success' }));
    });

    ws.on('close', () => {
        const index = clients.findIndex(client => client.clientId === ws.clientId);
        console.log(`WS Command Socket client disconnected: ${clients[index].clientId}`);
        if(clients.length > 1){
            if(clients[index].isOwner === true){
                clients.splice(index, 1)[0];
                clients[0].isOwner = true;
                clients[0].send(JSON.stringify({ hasOwner: false, isRunning: isRunning }));
                clients[0].send(JSON.stringify({systemParams: systemCurrentParams}));
            } 
        } else {
            hasOwner = false;
        }
        console.log(`WS Command clients still connected: ${clients.length}`);
    });
});

module.exports = wsCmdSocket;