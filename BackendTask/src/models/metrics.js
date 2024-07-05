// models/metrics.js

let logs = [];
let errorLogs = [];

const log = (requestInfo) => {
    logs.push(requestInfo);
    if (logs.length > 100) {
        logs.shift(); // Remove the oldest log entry to keep the size at 100
    }
};

const logError = (errorInfo) => {
    errorLogs.push(errorInfo);
    if (errorLogs.length > 100) {
        errorLogs.shift(); // Remove the oldest error log entry to keep the size at 100
    }
};

const getlogs = () => logs;

const getErrorLogs = () => errorLogs;

export default { 
    log,
    logError,
    getlogs,
    getErrorLogs
};
