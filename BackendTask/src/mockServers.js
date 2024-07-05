import express from 'express';

const mockserver = (port, requestTime, name) => {
    const app = express();

    // Define a GET route for '/weather'
    app.get('/weather', (req, res) => {
        // Simulate delayed response using setTimeout
        setTimeout(() => {
            res.json({ message: `${name} response`, temperature: Math.floor(Math.random() * 35) + 1 });
        }, requestTime); // requestTime determines the delay
    });

    // Start the Express server
    app.listen(port, (err) => {
        if (err) {
            console.error(`Error starting ${name} server on port ${port}:`, err);
        } else {
            console.log(`Mock server ${name} is running on port ${port}`);
        }
    });
};

// Directly call mockserver function to create multiple instances
mockserver('5040', 200, 'WeatherAPI1');
mockserver('3002', 100, 'WeatherAPI2');
mockserver('3003', 300, 'WeatherAPI3');
mockserver('3004', 250, 'WeatherAPI4');
mockserver('3005', 150, 'WeatherAPI5');

// Export the mockserver function (optional, depending on your use case)
export default mockserver;
