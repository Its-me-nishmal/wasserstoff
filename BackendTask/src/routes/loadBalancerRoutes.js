import express from 'express'
import { routerequest ,getmetrics } from '../controllers/loadBalancerController.js'
const router = express.Router();

router.get('/weather', routerequest);
router.get('/metrics', getmetrics);

export default router;
