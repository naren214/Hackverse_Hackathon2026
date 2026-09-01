import { Router } from 'express';
import { getAlerts, getAlert, createAlert, updateAlert, deleteAlert } from '../controllers/alerts.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getAlerts);
router.get('/:id', getAlert);
router.post('/', createAlert);
router.put('/:id', updateAlert);
router.delete('/:id', deleteAlert);

export default router;
