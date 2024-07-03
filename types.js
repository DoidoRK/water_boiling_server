// Define an "enum" using plain JavaScript objects
const MESSAGE_OP = {
    CONNECTION_ATTEMPT: 0,
    SERVER_CONNECTION_STABLISHED: 1,
    SYSTEM_PARAM_CHANGE: 2,
    SYSTEM_STARTUP: 3,
    SYSTEM_STATUS: 4,
    SYSTEM_INTR: 5,
    SYSTEM_SHUTDOWN: 6
};

// Define an "enum" using plain JavaScript objects
const DEVICE_TYPE = {
    ESP: 0,
    FRONT_END: 1,
    SERVER: 2
};

const MOCK_PARAMS = {
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

module.exports = { MESSAGE_OP, MOCK_PARAMS, DEVICE_TYPE };