import app from './app.js'
import mockserver from './mockServers.js';

mockserver('4564', 200, 'WeatherAPI1');
mockserver('6576', 100, 'WeatherAPI2');
mockserver('3020', 300, 'WeatherAPI3');
mockserver('8045', 250, 'WeatherAPI4');
mockserver('9948', 150, 'WeatherAPI5');


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port https://localhost:${PORT}`);
});