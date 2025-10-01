import { Router } from 'express';
import {
	createPoi,
	deletePoi,
	getAllPois,
	getPoiById,
	updatePoi,
} from '../controllers/pois.js';

const router = Router();

router.get('/', getAllPois);
router.get('/:id', getPoiById);
router.post('/', createPoi);
router.put('/:id', updatePoi);
router.delete('/:id', deletePoi);

export default router;
