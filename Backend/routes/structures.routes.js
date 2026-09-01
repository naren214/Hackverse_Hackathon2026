import { Router } from 'express';
import { getStructures, getStructure, createStructure, updateStructure, deleteStructure, exportReport } from '../controllers/structures.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.post('/:id/report', exportReport);
router.get('/', getStructures);
router.get('/:id', getStructure);
router.post('/', authorize('admin', 'engineer'), createStructure);
router.put('/:id', authorize('admin', 'engineer'), updateStructure);
router.delete('/:id', authorize('admin'), deleteStructure);

export default router;
