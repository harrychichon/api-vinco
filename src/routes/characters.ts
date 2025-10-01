import { Router } from 'express';
import {
	createCharacter,
	deleteCharacter,
	getAllCharacters,
	getCharacterBookStats,
	getCharacterById,
	getCharacterCountBySpecies,
	updateCharacter,
} from '../controllers/characters.js';

const router = Router();

router.get('/', getAllCharacters);
router.get('/stats/species', getCharacterCountBySpecies);
router.get('/:id', getCharacterById);
router.get('/:id/book-stats', getCharacterBookStats);
router.post('/', createCharacter);
router.put('/:id', updateCharacter);
router.delete('/:id', deleteCharacter);

export default router;
