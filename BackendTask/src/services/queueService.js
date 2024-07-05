import axios from 'axios'; // Import Axios library for making HTTP requests
import metrics from '../models/metrics.js'; // Import metrics module for logging
import { adjustPriority } from '../utils/priorityUtils.js'; // Import function to adjust request priority dynamically

// Initialize queues and request counter
let fifoQueue = [];
let priorityQueue = [];
let roundRobinQueue = [];
let requestCounter = 0;

// Function to enqueue a request in FIFO queue
const enqueueFIFO = (request) => {
    fifoQueue.push(request);
};

// Function to enqueue a request in priority queue with adjusted priority
const enqueuePriority = (request) => {
    request.priority = adjustPriority(request); // Adjust priority dynamically

    // Insert request in priority order
    if (priorityQueue.length === 0) {
        priorityQueue.push(request);
    } else {
        let added = false;
        for (let i = 0; i < priorityQueue.length; i++) {
            if (request.priority < priorityQueue[i].priority) {
                priorityQueue.splice(i, 0, request);
                added = true;
                break;
            }
        }
        if (!added) {
            priorityQueue.push(request);
        }
    }
};

// Function to enqueue a request in round-robin queue
const enqueueRoundRobin = (request) => {
    request.id = requestCounter++; // Assign a unique ID to the request
    roundRobinQueue.push(request);
    roundRobinQueue.sort((a, b) => a.id - b.id); // Ensure round-robin order based on ID
};

// Function to process requests from all queues
const processQueue = async () => {
    if (fifoQueue.length > 0) {
        const request = fifoQueue.shift(); // Dequeue request from FIFO queue
        await handleRequest(request); // Process the dequeued request
    }
    if (priorityQueue.length > 0) {
        const request = priorityQueue.shift(); // Dequeue request from priority queue
        await handleRequest(request); // Process the dequeued request
    }
    if (roundRobinQueue.length > 0) {
        const request = roundRobinQueue.shift(); // Dequeue request from round-robin queue
        await handleRequest(request); // Process the dequeued request
    }
};

// Function to handle an individual request
const handleRequest = async (request) => {
    const { endpoint, req, res } = request;

    // Check if endpoint is defined
    if (!endpoint) {
        console.error('Request failed: Endpoint is undefined');
        if (!res.headersSent) {
            res.status(500).send('Internal Server Error: Endpoint is undefined');
        }
        return;
    }

    try {
        let response;
        if (req) {
            response = await axios.get(endpoint.url, { params: req.query }); // Make GET request with query parameters
        } else {
            response = await axios.get(endpoint.url); // Make GET request without query parameters
        }

        // Log metrics with response time
        metrics.log({ ...request, responseTime: Date.now() - request.timestamp });
        
    } catch (error) {
        handleRequestError(request, error); // Handle request error
    } finally {
        // Decrease endpoint connections count after request handling
        endpoint.connections <= 0 ? endpoint.connections = 0 : endpoint.connections -= 1;
    }
};

// Function to handle request errors and implement retry mechanism
const handleRequestError = async (request, error) => {
    console.error('Request failed:', error);
    metrics.logError({ ...request, error }); // Log error in metrics

    // Implement retry mechanism with exponential backoff
    const retryLimit = 3;
    request.retries = (request.retries || 0) + 1;
    if (request.retries <= retryLimit) {
        console.log(`Retrying request (${request.retries}/${retryLimit})...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, request.retries))); // Exponential backoff
        switch (request.strategy) {
            case 'fifo':
                enqueueFIFO(request); // Re-enqueue request in FIFO queue
                break;
            case 'priority':
                enqueuePriority(request); // Re-enqueue request in priority queue
                break;
            case 'round-robin':
                enqueueRoundRobin(request); // Re-enqueue request in round-robin queue
                break;
        }
        processQueue(); // Process the queue after re-enqueuing
    } else {
        if (!request.res.headersSent) {
            request.res.status(500).send('Internal Server Error after multiple retries');
        }
    }
};

// Export functions for queue management and processing
export { enqueueFIFO, enqueuePriority, enqueueRoundRobin, processQueue };
