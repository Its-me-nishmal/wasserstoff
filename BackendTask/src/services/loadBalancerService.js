import axios from 'axios';
import { getIPAddress } from '../utils/network.js';

const apiendpoints = [
    { name: 'WeatherAPI1', url: `http://${getIPAddress()}:5040/weather`, responseTime: 200, weight: 1, healthy: true, connections: 0 },
    { name: 'WeatherAPI2', url: `http://${getIPAddress()}:3002/weather`, responseTime: 100, weight: 2, healthy: true, connections: 0 },
    { name: 'WeatherAPI3', url: `http://${getIPAddress()}:3003/weather`, responseTime: 300, weight: 1, healthy: true, connections: 0 },
    { name: 'WeatherAPI4', url: `http://${getIPAddress()}:3004/weather`, responseTime: 250, weight: 2, healthy: true, connections: 0 },
    { name: 'WeatherAPI5', url: `http://${getIPAddress()}:3005/weather`, responseTime: 150, weight: 1, healthy: false, connections: 0 }
];

let currentIndex = 0;
const maxweight = Math.max(...apiendpoints.map(api => api.weight));

export const checkHealth = async () => {
    for (const api of apiendpoints) {
        try {
            await axios.get(api.url);
            api.healthy = true;
        } catch (error) {
            api.healthy = false;
            console.log(error);
        }
    }
};

export const getnextEndpoint = () => {
    let attempts = 0;
    while (attempts < apiendpoints.length) {
        currentIndex = (currentIndex + 1) % apiendpoints.length;
        if (apiendpoints[currentIndex].healthy) {
            return apiendpoints[currentIndex];
        }
        attempts++;
    }
    return null;
};

export const getRandomEndpoint = () => {
    const healthyEndpoints = apiendpoints.filter(api => api.healthy);
    if (healthyEndpoints.length === 0) return null;
    const totalWeight = healthyEndpoints.reduce((acc, api) => acc + api.weight, 0);
    let randomWeight = Math.floor(Math.random() * totalWeight);
    
    for (const api of healthyEndpoints) {
        if (randomWeight < api.weight) {
            return api;
        }
        randomWeight -= api.weight;
    }
};

export const getLeastResponseTimeEndpoint = () => {
    const healthyEndpoints = apiendpoints.filter(api => api.healthy);
    if (healthyEndpoints.length === 0) return null;
    return healthyEndpoints.reduce((prev, curr) => prev.responseTime < curr.responseTime ? prev : curr);
};

export const getLeastConnectionEndpoint = () => {
    const healthyEndpoints = apiendpoints.filter(api => api.healthy);
    if (healthyEndpoints.length === 0) return null;
    return healthyEndpoints.reduce((prev, curr) => prev.connections < curr.connections ? prev : curr);
};
