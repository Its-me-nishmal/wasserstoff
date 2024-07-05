# Load Balancer Service

This service is a load balancer that routes incoming requests to different endpoints based on specified strategies. It supports various queueing mechanisms and logs metrics for each request. This README provides an overview of the service, setup instructions, usage details, and examples.

## Features

- **Load Balancing Strategies**: Supports `random`, `round-robin`, `least-response-time`, and `least-connection` strategies.
- **Queueing Mechanisms**: Supports `FIFO`, `priority`, and `round-robin` queues for processing requests.
- **Metrics Logging**: Logs request details and errors for monitoring and analysis.
- **Health Checks**: Periodically checks the health of endpoints.

## Setup

### Prerequisites

- Node.js (version 12 or higher)
- npm (version 6 or higher)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Its-me-nishmal/wasserstoff.git
    cd wasserstoff/BackendTask
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

### Configuration

Ensure your endpoints and configurations are set up in `services/loadBalancerService.js` and `models/metrics.js`. Update these files with your specific endpoints and logging configurations.

## Usage

### Start the Service

To start the service, run:

```bash
npm start
