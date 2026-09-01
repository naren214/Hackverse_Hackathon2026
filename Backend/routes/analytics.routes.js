import { Router } from 'express';
import { getPredictions, getAnomalies, getCostForecasts, getModelMetrics, getDashboardStats } from '../controllers/analytics.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/predictions', getPredictions);
router.get('/anomalies', getAnomalies);
router.get('/cost-forecasts', getCostForecasts);
router.get('/model-metrics', getModelMetrics);
router.get('/dashboard-stats', getDashboardStats);

export default router;
