// Importing required modules
import express from 'express';
import loadBalancer from './routes/loadBalancerRoutes.js'; // Assuming this is where your router is defined
import morgan from 'morgan';

// Creating an Express application instance
const app = express();

// Middleware setup
app.use(morgan('dev')); // Logging HTTP requests in the console

// Basic route handling
app.get('/', (req, res) => res.json({ message: 'server is running' })); // Responds with a simple message when root path is accessed

// Route handling with '/api' prefix
app.use('/api', loadBalancer); // Mounting load balancer routes under '/api'

// Exporting the configured Express app instance
export default app;
