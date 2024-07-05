// router.js

// Importing Express and controllers
import express from 'express';
import { routerequest, getmetrics } from '../controllers/loadBalancerController.js';

// Creating a new router instance
const router = express.Router();

// Defining routes and associating them with controller functions
router.get('/weather', routerequest); // Route for weather-related requests
router.get('/metrics', getmetrics); // Route for retrieving metrics

// Exporting the router to be used by other parts of the application
export default router;
