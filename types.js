// types.js

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

module.exports = { MESSAGE_OP };