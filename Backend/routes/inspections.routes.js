import { Router } from 'express';
import { getInspections, getInspection, createInspection, exportPdf, scheduleInspection } from '../controllers/inspections.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/export/pdf', exportPdf);
router.post('/schedule', scheduleInspection);
router.get('/', getInspections);
router.get('/:id', getInspection);
router.post('/', createInspection);

export default router;
