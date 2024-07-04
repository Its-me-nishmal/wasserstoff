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

// Export the mockserver function
export default mockserver;
