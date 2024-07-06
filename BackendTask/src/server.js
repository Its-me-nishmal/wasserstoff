import app from './app.js';
import './mockServers.js'; // Assuming this imports and starts mock servers
import cron from 'node-cron';
import axios from 'axios';

const PORT = process.env.PORT || 5000;

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

// Cron job to monitor an external link every 30 secound
cron.schedule('*/30 * * * * *', async () => {
  try {
    const response = await axios.get('https://wasserstoff-mwr1.onrender.com');
    console.log(`External link is up. Status code: ${response.status}`);
  } catch (error) {
    console.error('Error accessing external link:', error.message);
  }
});

// Periodic log to indicate server is active
setInterval(() => {
  console.log('Server is still running...');
}, 10000); // Logs every 10 seconds
