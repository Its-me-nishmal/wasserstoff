import axios from 'axios'; // Import Axios library for making HTTP requests
import { getIPAddress } from '../utils/network.js'; // Import function to get the IP address of the machine

// Array of API endpoints with their properties
const apiendpoints = [
    { id: 1, name: 'WeatherAPI1', url: `http://${getIPAddress()}:5040/weather`, responseTime: 200, weight: 1, healthy: true, connections: 0 },
    { id: 2, name: 'WeatherAPI2', url: `http://${getIPAddress()}:3002/weather`, responseTime: 100, weight: 2, healthy: true, connections: 0 },
    { id: 3, name: 'WeatherAPI3', url: `http://${getIPAddress()}:3003/weather`, responseTime: 300, weight: 1, healthy: true, connections: 0 },
    { id: 4, name: 'WeatherAPI4', url: `http://${getIPAddress()}:3004/weather`, responseTime: 250, weight: 2, healthy: true, connections: 0 },
    { id: 5, name: 'WeatherAPI5', url: `http://${getIPAddress()}:3005/weather`, responseTime: 150, weight: 1, healthy: false, connections: 0 }
];

let currentIndex = 0; // Index used for round-robin endpoint selection
const maxweight = Math.max(...apiendpoints.map(api => api.weight)); // Maximum weight among all endpoints

// Function to check health of all endpoints asynchronously
export const checkHealth = async () => {
    for (const api of apiendpoints) {
        try {
            await axios.get(api.url); // Make a GET request to the endpoint's URL
            api.healthy = true; // Mark the endpoint as healthy if request succeeds
        } catch (error) {
            api.healthy = false; // Mark the endpoint as unhealthy if request fails
            console.log(error); // Log the error to the console for debugging
        }
    }
};

// Function to get the next healthy endpoint using round-robin strategy
export const getnextEndpoint = () => {
    let attempts = 0;
    while (attempts < apiendpoints.length) {
        currentIndex = (currentIndex + 1) % apiendpoints.length; // Move to the next endpoint in a circular manner
        if (apiendpoints[currentIndex].healthy) {
            return apiendpoints[currentIndex]; // Return the endpoint if it is healthy
        }
        attempts++;
    }
    return null; // Return null if no healthy endpoint is found after all attempts
};

// Function to get a random healthy endpoint based on weights
export const getRandomEndpoint = () => {
    const healthyEndpoints = apiendpoints.filter(api => api.healthy); // Filter out only healthy endpoints
    if (healthyEndpoints.length === 0) return null; // Return null if no healthy endpoints exist
    const totalWeight = healthyEndpoints.reduce((acc, api) => acc + api.weight, 0); // Calculate total weight of all healthy endpoints
    let randomWeight = Math.floor(Math.random() * totalWeight); // Generate a random weight value
    
    for (const api of healthyEndpoints) {
        if (randomWeight < api.weight) {
            return api; // Return the endpoint if the random weight falls within its weight range
        }
        randomWeight -= api.weight; // Subtract the endpoint's weight from randomWeight
    }
};

// Function to get the endpoint with the least response time among healthy endpoints
export const getLeastResponseTimeEndpoint = () => {
    const healthyEndpoints = apiendpoints.filter(api => api.healthy); // Filter out only healthy endpoints
    if (healthyEndpoints.length === 0) return null; // Return null if no healthy endpoints exist
    return healthyEndpoints.reduce((prev, curr) => prev.responseTime < curr.responseTime ? prev : curr); // Reduce to find endpoint with minimum responseTime
};

// Function to get the endpoint with the least active connections among healthy endpoints
export const getLeastConnectionEndpoint = () => {
    const healthyEndpoints = apiendpoints.filter(api => api.healthy); // Filter out only healthy endpoints
    if (healthyEndpoints.length === 0) return null; // Return null if no healthy endpoints exist
    return healthyEndpoints.reduce((prev, curr) => prev.connections < curr.connections ? prev : curr); // Reduce to find endpoint with minimum connections
};
