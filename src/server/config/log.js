const winston = require('winston');

// Function to create and configure a logger instance
function createLogger(filename) {
    return winston.createLogger({
        transports: [
            new winston.transports.File({ filename })
        ]
    }); 
}

// Export the createLogger function
module.exports = {createLogger};
