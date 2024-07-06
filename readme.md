# Project: backendtask
Version: 1.0.0
Description: A load balancer MERN application

## Table of Contents
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)
- [Scripts](#scripts)
- [Environment Setup](#environment-setup)
- [API Endpoints](#api-endpoints)
- [Load Balancer Strategies](#load-balancer-strategies)
- [Queue Management](#queue-management)
- [Metrics and Logging](#metrics-and-logging)
- [Health Check](#health-check)

## Project Structure

backendtask/                      
├── src/                     
│   ├── controllers/   
│   │   └── loadBalancerController.js  
│   ├── models/     
│   │   └── metrics.js     
│   ├── routes/     
│   │   └── loadBalancerRoutes.js     
│   ├── services/     
│   │   ├── loadBalancerService.js     
│   │   └── queueService.js     
│   ├── utils/     
│   │   ├── network.js     
│   │   └── priorityUtils.js     
│   ├── app.js     
│   └── server.js     
├── mockServers.js     
├── package.json     
└── README.md     


## Dependencies
### Core Dependencies
- ![#007acc](https://via.placeholder.com/15/007acc/000000?text=+) `axios`: ^1.7.2 - For making HTTP requests
- ![#007acc](https://via.placeholder.com/15/007acc/000000?text=+) `express`: ^4.19.2 - Web framework for Node.js
- ![#007acc](https://via.placeholder.com/15/007acc/000000?text=+) `morgan`: ^1.10.0 - HTTP request logger middleware for Node.js
- ![#007acc](https://via.placeholder.com/15/007acc/000000?text=+) `node-cron`: ^3.0.3 - For running cron jobs in Node.js
- ![#007acc](https://via.placeholder.com/15/007acc/000000?text=+) `pm2`: ^5.4.1 - Process manager for Node.js applications

### Development Dependencies
- ![#007acc](https://via.placeholder.com/15/007acc/000000?text=+) `nodemon`: ^3.1.4 - Utility that monitors for changes in source code and automatically restarts the server

## Scripts
- `start`: Starts the server using `node src/server.js`
- `test`: Placeholder for test scripts

## Environment Setup
### Clone the repository
```bash
git clone https://github.com/Its-me-nishmal/wasserstoff.git
cd wasserstoff
```
### Install dependencies
```bash
npm install
```
### Start the server
```bash
node src/server.js
```

## API Endpoints
- `/api/weather`: Route for weather-related requests
- `/api/metrics`: Route for retrieving metrics/logs


### /weather
Routes weather-related requests based on the selected strategy and queue type.

#### Query Parameters:
- `strategy`: Determines the load balancing strategy (e.g., round-robin, random, least-response-time, least-connection)
- `queue`: Determines the queue type for request processing (e.g., fifo, priority, round-robin)

### /metrics
Retrieves logs and metrics of the requests.

## Load Balancer Strategies

- **Round Robin**: Selects the next endpoint in a circular manner.
- **Random**: Selects a random healthy endpoint based on weights.
- **Least Response Time**: Selects the endpoint with the lowest response time.
- **Least Connection**: Selects the endpoint with the fewest active connections.

## Queue Management

- **FIFO (First In, First Out)**: Requests are processed in the order they arrive.
- **Priority**: Requests are processed based on dynamically adjusted priority.
- **Round Robin**: Requests are processed in a round-robin manner.

## Metrics and Logging

### Metrics Model

- `logs`: Stores logs of request information.
- `errorLogs`: Stores logs of error information.

### Functions

- `log(requestInfo)`: Logs request information.
- `logError(errorInfo)`: Logs error information.
- `getlogs()`: Retrieves all logs.
- `getErrorLogs()`: Retrieves all error logs.

## Health Check

Periodically checks the health of all endpoints every 5 seconds.

```javascript
setInterval(checkHealth, 5000);

```
### Health Check Function
```javascript
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
```