import express from 'express';
import loadBalancer from './routes/loadBalancerRoutes.js';
import morgan from 'morgan';

const app = express();

app.use(morgan('dev'));
app.get('/', (req, res) => res.json({ message: 'server is running' })); 
app.use('/api', loadBalancer);

export default app;
