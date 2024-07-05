import axios from 'axios';
import metrics from '../models/metrics.js';
import os from 'os';

const getIPAddress = () => {
    const interfaces = os.networkInterfaces();
    for (const iface in interfaces) {
        for (const alias of interfaces[iface]) {
            if (alias.family === 'IPv4' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return '127.0.0.1';
};

const host = getIPAddress();

const apiendpoints = [
    { name: 'WeatherAPI1', url: `http://${host}:5040/weather`, responseTime: 200, weight: 1, healthy: true },
    { name: 'WeatherAPI2', url: `http://${host}:3002/weather`, responseTime: 100, weight: 2, healthy: true },
    { name: 'WeatherAPI3', url: `http://${host}:3003/weather`, responseTime: 300, weight: 1, healthy: true },
    { name: 'WeatherAPI4', url: `http://${host}:3004/weather`, responseTime: 250, weight: 2, healthy: true },
    { name: 'WeatherAPI5', url: `http://${host}:3005/weather`, responseTime: 150, weight: 1, healthy: false } // Marking this endpoint as unhealthy initially
];

let currentIndex = 0;
let currentweight = 0;
const maxweight = Math.max(...apiendpoints.map(api => api.weight));

const checkHealth = async () => {
    for (const api of apiendpoints) {
        try {
            const response = await axios.get(api.url);
            api.healthy = true;
        } catch (error) {
            api.healthy = false; 
            console.log(error);
        }
    }
};

const getnextEndpoint = () => {
    let attempts = 0;
    while (attempts < apiendpoints.length) {
        currentIndex = (currentIndex + 1) % apiendpoints.length;
        currentweight = (currentweight + apiendpoints[currentIndex].weight) % maxweight;
        if (apiendpoints[currentIndex].healthy) {
            return apiendpoints[currentIndex];
        }
        attempts++;
    }
    return null;
};

const routerequest = async (req, res) => {
    const endpoint = getnextEndpoint();
    if (!endpoint) {
        return res.status(503).send('No healthy endpoints available');
    }

    const requestInfo = {
        name: endpoint.name,
        url: endpoint.url,
        responseTime: endpoint.responseTime,
        weight: endpoint.weight,
        healthy: endpoint.healthy,
        timestamp: Date.now()
    };
    try {
        const response = await axios.get(endpoint.url);
        metrics.log(requestInfo);
        res.json({
            message: `Routed to ${endpoint.url}`,
            data: response.data,
            requestInfo
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const getmetrics = async (req, res) => {
    const logs = await metrics.getLogs();
    res.json(logs);
};

setInterval(checkHealth, 5000);

export {
    routerequest,
    getmetrics
};
