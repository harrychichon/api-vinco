import { Router } from 'express';
import {
	createSpecies,
	deleteSpecies,
	getAllSpecies,
	getSpeciesById,
	updateSpecies,
} from '../controllers/species.js';

const router = Router();

router.get('/', getAllSpecies);
router.get('/:id', getSpeciesById);
router.post('/', createSpecies);
router.put('/:id', updateSpecies);
router.delete('/:id', deleteSpecies);

export default router;
