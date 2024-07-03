const net = require('net');
const os = require('os');
const { MESSAGE_OP } = require('./types');

const mock_params = {
    "message_type": 3,
    "system_settings": {
        "input_valve_flow_speed": 150,
        "middle_valve_flow_speed": 150,
        "output_valve_flow_speed": 150,
        "water_boiling_rate": 150,
        "sensor_reading_timer": 100,
        "water_tank_water_max_level": 95,
        "water_tank_water_min_level": 20,
        "boiling_tank_water_max_level": 95,
        "boiling_tank_water_min_level": 20
    },
    "sensor_readings": {
        "max_sensor_tank1": 0,
        "min_sensor_tank1": 0,
        "water_level_tank1": 0,
        "temp_water_tank2": 27,
        "max_sensor_tank2": 0,
        "min_sensor_tank2": 0,
        "water_level_tank2": 0,
        "input_valve_status": 0,
        "middle_valve_status": 0,
        "output_valve_status": 0,
        "resistance_status": 0,
        "water_is_boiled": 0
    }
}

const PORT = 8080;
var startup = 0;
var HOST = '0.0.0.0';
var ips = os.networkInterfaces();
Object
  .keys(ips)
  .forEach(function(_interface) {
     ips[_interface]
      .forEach(function(_dev) {
        if (_dev.family === 'IPv4' && !_dev.internal) HOST = _dev.address 
      }) 
  });

const server = net.createServer((socket) => {
    console.log('Client connected');


    socket.on('data', (data) => {
        console.log('Received data from client:', data.toString());
        switch (data.message_type) {
            case CONNECTION_ATTEMPT:
                //Frontend client trying to connect to server
                //Gets this client data and saves it as current user
                //If answers with a SERVER_CONNECTION_STABLISHED to tell the client it can control the system
                
                break;

            case SYSTEM_PARAM_CHANGE:
                //Frontend client wants to change system params
                //Answers with a success in case the ESP receives the update successfully
                //Answers with a fail in case the ESP fails to update.
                
                break;

            case SYSTEM_STARTUP:
                //Frontend client is saying the system configuration is done
                //Sends ack to front end client and Starts up system simulation in ESP32
                break;

            case SYSTEM_STATUS:
                //Incoming message from ESP updating the client about the simulation status.
                //Just reroutes the data to the front end client.                
                break;

            case SYSTEM_INTR:
                //Frontend client telling ESP32 to interrupt it's simulation.
                //(Closes all valves and turns off the resistance that heats up the water).                
                break;

            case SYSTEM_SHUTDOWN:
                //Frontend client saying the system must be shut down.
                //ESP32 empties both tanks in simulation and shuts down.                
                break;
        
            default:
                console.error('Unknwon message type.');
                break;
        }
        const response = { status: 'success'};
        socket.write(JSON.stringify(response));
    });

    socket.on('end', () => {
        console.log('Client disconnected');
    });

    socket.on('error', (err) => {
        console.error('Socket error:', err);
    });
});

server.listen(PORT, HOST, () => {
    console.log(`Server listening on ${HOST}:${PORT}`);
});
