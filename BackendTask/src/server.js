import app from './app.js';
import './mockServers.js'; // Assuming this imports and starts mock servers

const PORT = process.env.PORT || 5000;

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

// Periodic log to indicate server is active
setInterval(() => {
  console.log('Server is still running...');
}, 10000); // Logs every 10 seconds
