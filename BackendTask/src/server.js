import app from './app.js'
import mockserver from './mockServers.js';
mockserver('5040', 200, 'WeatherAPI1');
mockserver('3002', 100, 'WeatherAPI2');
mockserver('3003', 300, 'WeatherAPI3');
mockserver('3004', 250, 'WeatherAPI4');
mockserver('3005', 150, 'WeatherAPI5');



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`Server is running on port https://localhost:${PORT}`);
  
});