import app from './app.js'
import './mockServers.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`Server is running on port https://localhost:${PORT}`);
  
});