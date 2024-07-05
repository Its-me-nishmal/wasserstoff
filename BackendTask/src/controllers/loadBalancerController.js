import { getnextEndpoint, getRandomEndpoint, getLeastResponseTimeEndpoint, getLeastConnectionEndpoint, checkHealth } from '../services/loadBalancerService.js';
import metrics from '../models/metrics.js';
import axios from 'axios';

export const routerequest = async (req, res) => {
    const strategy = req.query.strategy || 'random';
    let endpoint;

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

    if (!endpoint) {
        return res.status(503).send('No healthy endpoints available');
    }

    endpoint.connections += 1; // Increment connection count

    const requestInfo = {
        name: endpoint.name,
        url: endpoint.url,
        responseTime: endpoint.responseTime,
        weight: endpoint.weight,
        healthy: endpoint.healthy,
        strategy: strategy,
        connections: endpoint.connections,
        timestamp: Date.now(),
    };

    const queryParams = req.query;
    const requestUrl = endpoint.url + '?' + new URLSearchParams(queryParams).toString();

    try {
        const response = await axios.get(requestUrl);
        metrics.log(requestInfo);
        res.json({
            message: `Routed to ${endpoint.url} using strategy ${strategy}`,
            data: response.data,
            requestInfo
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    } finally {
        endpoint.connections -= 1; // Decrement connection count after response
    }
};

export const getmetrics = async (req, res) => {
    const logs = await metrics.getlogs();
    res.json(logs);
};

// Health check interval
setInterval(checkHealth, 5000);
