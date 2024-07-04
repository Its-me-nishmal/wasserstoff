let logs = []

const log = (requistinfo) => logs.push(requistinfo);
const getlogs = () => logs;

export default { 
    log,
    getlogs
};