import { Router } from 'express';
import { getSensors, getSensor, createSensor, updateSensor, deleteSensor } from '../controllers/sensors.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', getSensors);
router.get('/:id', getSensor);
router.post('/', createSensor);
router.put('/:id', updateSensor);
router.delete('/:id', deleteSensor);

export default router;
