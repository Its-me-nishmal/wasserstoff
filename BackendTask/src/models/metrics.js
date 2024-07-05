// models/metrics.js

// Arrays to store logs and error logs
let logs = [];
let errorLogs = [];

// Function to log request information
const log = (requestInfo) => {
    logs.push(requestInfo);
    if (logs.length > 100) {
        logs.shift(); // Remove the oldest log entry to keep the size at 100
    }
};

// Function to log error information
const logError = (errorInfo) => {
    errorLogs.push(errorInfo);
    if (errorLogs.length > 100) {
        errorLogs.shift(); // Remove the oldest error log entry to keep the size at 100
    }
};

// Function to retrieve all logs
const getlogs = () => logs;

// Function to retrieve all error logs
const getErrorLogs = () => errorLogs;

// Exporting functions to be used by other modules
export default { 
    log,
    logError,
    getlogs,
    getErrorLogs
};
