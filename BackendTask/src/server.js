import app from './app.js';
import './mockServers.js'; // Assuming this imports and starts mock servers
import './services/cronTask.js' // Assuming this imports and starts cron jobs

const PORT = process.env.PORT || 5000;

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

