import { Router } from 'express';
import {
	createBook,
	deleteBook,
	getAllBooks,
	getBookById,
	getBookMetadata,
	getBooksMetadata,
	updateBook,
} from '../controllers/books.js';

const router = Router();

router.get('/', getAllBooks);
router.get('/metadata', getBooksMetadata);
router.get('/:id', getBookById);
router.get('/:id/metadata', getBookMetadata);
router.post('/', createBook);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

export default router;
