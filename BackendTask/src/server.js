import app from './app.js';
import './mockServers.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port https://localhost:${PORT}`);
});

// Keep the server active
setInterval(() => {
  console.log('Server is still running...');
}, 10000); // This will log every 10 seconds
