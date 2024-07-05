import axios from 'axios';
import { 
    getnextEndpoint, 
    getRandomEndpoint, 
    getLeastResponseTimeEndpoint, 
    getLeastConnectionEndpoint, 
    checkHealth 
} from '../services/loadBalancerService.js';
import metrics from '../models/metrics.js';
import { 
    enqueueFIFO, 
    enqueuePriority, 
    enqueueRoundRobin, 
    processQueue 
} from '../services/queueService.js';

// Route incoming requests based on strategy and queue type
export const routerequest = async (req, res) => {
    // Extract strategy and queue type from query parameters
    const strategy = req.query.strategy || 'random';
    const queue = req.query.queue || 'fifo';

    let endpoint;

    // Determine endpoint based on selected strategy
    switch (strategy) {
        case 'round-robin':
            endpoint = getnextEndpoint();
            break;
        case 'random':
            endpoint = getRandomEndpoint();
            break;
        case 'least-response-time':
            endpoint = getLeastResponseTimeEndpoint();
            break;
        case 'least-connection':
            endpoint = getLeastConnectionEndpoint();
            break;
        default:
            return res.status(400).send('Invalid strategy');
    }

    // Handle case where no healthy endpoint is available
    if (!endpoint) {
        return res.status(503).send('No healthy endpoints available');
    }

    // Initialize connection count if not present
    if (typeof endpoint.connections !== 'number') {
        endpoint.connections = 0;
    }

    // Increment connection count for the selected endpoint
    endpoint.connections += 1;

    // Information about the incoming request
    const requestInfo = {
        name: endpoint.name,
        url: endpoint.url,
        responseTime: endpoint.responseTime,
        weight: endpoint.weight,
        healthy: endpoint.healthy,
        strategy: strategy,
        endpoint: endpoint,
        connections: endpoint.connections,
        timestamp: Date.now(),
        requestDetails: { query: req.query, params: req.params, body: req.body }
    };

    // Enqueue the request based on the selected queue strategy
    switch (queue) {
        case 'fifo':
            enqueueFIFO(requestInfo);
            break;
        case 'priority':
            enqueuePriority(requestInfo);
            break;
        case 'round-robin':
            enqueueRoundRobin(requestInfo);
            break;
        default:
            enqueueFIFO(requestInfo); // Default to FIFO queue
    }

    // Process the queue to handle enqueued requests
    processQueue();

    // Construct the request URL with query parameters
    const queryParams = req.query;
    const requestUrl = endpoint.url + '?' + new URLSearchParams(queryParams).toString();

    try {
        // Make a GET request to the determined endpoint URL
        const response = await axios.get(requestUrl);

        // Log request metrics
        metrics.log(requestInfo);

        // Respond with routed information and response data
        res.json({
            message: `Routed to ${endpoint.url} using strategy ${strategy}`,
            data: response.data,
            requestInfo
        });
    } catch (error) {
        // Handle request failure
        console.error('Request failed:', error);

        // Log error in metrics
        metrics.logError({ ...requestInfo, error: error.message });

        // Ensure response is sent only if headers are not already sent
        if (!res.headersSent) {
            res.status(500).send('Internal Server Error');
        }
    } finally {
        // Decrement connection count after request processing
        endpoint.connections -= 1; 
    }
};

// Retrieve metrics/logs endpoint
export const getmetrics = async (req, res) => {
    // Fetch logs/metrics from the metrics module
    const logs = await metrics.getlogs();
    
    // Respond with fetched logs/metrics
    res.json(logs);
};

// Periodically check endpoint health every 5 seconds
setInterval(checkHealth, 5000);
