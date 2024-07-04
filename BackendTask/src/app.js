import express from 'express'
import loadBalancer from './routes/loadBalancerRoutes.js'
import morgan from 'morgan'

const app = express();

app.use(morgan('dev'));
app.use('/',(req,res) => res.json({messge:'server is running'}))
app.use('/api',loadBalancer);

export default app;