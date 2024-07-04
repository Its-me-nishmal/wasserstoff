import express from 'express'

const mockserver = (port,requistTime,name) => {
    const app = express();
    app.get('/weather',(req,res)=> {
        setTimeout(() => {
            res.json({ message: `${name} response`, temperature: Math.floor(Math.random() * 35) + 1 });
        },requistTime);
    })
    app.listen(port, () => {
        console.log(`Mock server is running on port ${port}`)
    })
}
mockserver('3001',200,'WeatherAPI1');
mockserver('3002',100,'WeatherAPI2');
mockserver('3003',300,'WeatherAPI3');
mockserver('3004',250,'WeatherAPI4');
mockserver('3005',150,'WeatherAPI5');
    