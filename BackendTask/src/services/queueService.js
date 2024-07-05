import axios from 'axios';
import metrics from '../models/metrics.js';
import { adjustPriority } from '../utils/priorityUtils.js';

let fifoQueue = [];
let priorityQueue = [];
let roundRobinQueue = [];
let requestCounter = 0;

const enqueueFIFO = (request) => {
    fifoQueue.push(request);
};

const enqueuePriority = (request) => {
    request.priority = adjustPriority(request); // Adjust priority dynamically
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

const enqueueRoundRobin = (request) => {
    request.id = requestCounter++;
    roundRobinQueue.push(request);
    roundRobinQueue.sort((a, b) => a.id - b.id); // Ensure round-robin order
};

const processQueue = async () => {
    if (fifoQueue.length > 0) {
        const request = fifoQueue.shift();
        await handleRequest(request);
    }
    if (priorityQueue.length > 0) {
        const request = priorityQueue.shift();
        await handleRequest(request);
    }
    if (roundRobinQueue.length > 0) {
        const request = roundRobinQueue.shift();
        await handleRequest(request);
    }
};

const handleRequest = async (request) => {
    const { endpoint, req, res } = request;

    if (!endpoint) {
        console.error('Request failed: Endpoint is undefined');
        if (!res.headersSent) {
            res.status(500).send('Internal Server Error: Endpoint is undefined');
        }
        return;
    }

    try {
        let response;
        if ( req ) {
            response = await axios.get(endpoint.url, { params: req.query });
        } else { 
            response = await axios.get(endpoint.url);

        }
        metrics.log({ ...request, responseTime: Date.now() - request.timestamp });
        
    } catch (error) {
        handleRequestError(request, error);
    } finally {
        endpoint.connections <= 0 ? endpoint.connections = 0 : endpoint.connections -= 1;
    }
};

const handleRequestError = async (request, error) => {
    console.error('Request failed:', error);
    metrics.logError({ ...request, error });

    // Implement a retry mechanism with exponential backoff
    const retryLimit = 3;
    request.retries = (request.retries || 0) + 1;
    if (request.retries <= retryLimit) {
        console.log(`Retrying request (${request.retries}/${retryLimit})...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, request.retries))); // Exponential backoff
        switch (request.strategy) {
            case 'fifo':
                enqueueFIFO(request);
                break;
            case 'priority':
                enqueuePriority(request);
                break;
            case 'round-robin':
                enqueueRoundRobin(request);
                break;
        }
        processQueue(); // Process the queue after re-enqueuing
    } else {
        if (!request.res.headersSent) {
            request.res.status(500).send('Internal Server Error after multiple retries');
        }
    }
};

export { enqueueFIFO, enqueuePriority, enqueueRoundRobin, processQueue };
