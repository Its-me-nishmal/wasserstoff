import axios from 'axios';
import metrics from '../models/metrics.js';

const apiendpoints = [
    { name: 'WeatherAPI1', url: 'http://localhost:3001/weather', responseTime: 200, weight: 1, healthy: true },
    { name: 'WeatherAPI2', url: 'http://localhost:3002/weather', responseTime: 100, weight: 2, healthy: true },
    { name: 'WeatherAPI3', url: 'http://localhost:3003/weather', responseTime: 300, weight: 1, healthy: true },
    { name: 'WeatherAPI4', url: 'http://localhost:3004/weather', responseTime: 250, weight: 2, healthy: true },
    { name: 'WeatherAPI5', url: 'http://localhost:3005/weather', responseTime: 150, weight: 1, healthy: true }
]

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
}

const getnextEndpoint = () => {
    currentIndex = (currentIndex + 1) % apiendpoints.length;
    currentweight = (currentweight + apiendpoints[currentIndex].weight) % maxweight;
    return apiendpoints[currentIndex];
}

const routerequest = async (req, res) => {
    const endpoint = getnextEndpoint();
    const requestInfo = {
        name: endpoint.name,
        url: endpoint.url,
        responseTime: endpoint.responseTime,
        weight: endpoint.weight,
        healthy: endpoint.healthy,
        timstamp: Date.now()
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
}

const getmetrics = (req, res) => {
    const logs = metrics.getlogs();
    res.json(logs);
}

setInterval(checkHealth, 5000);

export {
    routerequest,
    getmetrics
}
