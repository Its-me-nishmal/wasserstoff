import express from 'express';

const mockserver = (port, requestTime, name) => {
    const app = express();
    app.get('/weather', (req, res) => {
        setTimeout(() => {
            res.json({ message: `${name} response`, temperature: Math.floor(Math.random() * 35) + 1 });
        }, requestTime);
    });
    app.listen(port, (err) => {
        if (err) {
            console.error('Error starting the server:', err);
        } else {
            console.log(`Mock server is running on port ${port}`);
        }
    });
};

// Direct Call
mockserver('5040', 200, 'WeatherAPI1');
mockserver('3002', 100, 'WeatherAPI2');
mockserver('3003', 300, 'WeatherAPI3');
mockserver('3004', 250, 'WeatherAPI4');
mockserver('3005', 150, 'WeatherAPI5');

// Export the mockserver function
export default mockserver;
