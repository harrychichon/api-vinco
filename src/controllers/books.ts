import { NextFunction, Request, Response } from 'express';
import BookModel, { IBook } from '../models/Book.js';
import {
	ApiResponse,
	BookMetadata,
	PaginatedResponse,
} from '../types/index.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
	createFetchError,
	createInvalidIdError,
	createNotFoundError,
	createValidationError,
} from '../utils/errors.js';
import { buildFilterQuery, FilterConfig } from '../utils/filters.js';
import {
	buildPaginationResult,
	getPaginationOptions,
} from '../utils/pagination.js';

/** GET /api/books - Get all books with  pagination and filters */
export const getAllBooks = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const filterConfig: Record<string, FilterConfig> = {
			title: { field: 'title', type: 'text' },
			publication_year: { field: 'publication_year', type: 'number' },
			publication_year_min: { field: 'publication_year', type: 'number' },
			publication_year_max: { field: 'publication_year', type: 'number' },
		};
		const filter = buildFilterQuery(req, filterConfig);

		const paginationOptions = getPaginationOptions(req);

		const [books, total] = await Promise.all([
			BookModel.find(filter)
				.skip(paginationOptions.skip)
				.limit(paginationOptions.limit)
				.sort({ createdAt: -1 }),
			BookModel.countDocuments(filter),
		]);

		const response: ApiResponse<PaginatedResponse<IBook>> = {
			success: true,
			data: buildPaginationResult(books, total, paginationOptions),
		};

		res.json(response);
	}
);

/** GET /api/books/:id - Get a single book by ID */
export const getBookById = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params;

		try {
			const book = await BookModel.findById(id);

			if (!book) {
				return next(createNotFoundError('BOOK'));
			}

			const response: ApiResponse<IBook> = {
				success: true,
				data: book,
			};

			res.json(response);
		} catch (error) {
			if ((error as any).name === 'CastError') {
				return next(createInvalidIdError('BOOK'));
			}
			next(createFetchError('FETCH_ONE', 'book'));
		}
	}
);

export const getBookMetadata = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params;

		try {
			const book = await BookModel.findById(id).select(
				'title blurb characters publicationYear'
			);

			if (!book) {
				return next(createNotFoundError('BOOK'));
			}

			const metadata: BookMetadata = {
				id: book.id,
				title: book.title,
				blurb: book.blurb,
				characters: book.characters.map((id) => id.toString()),
				publication_year: book.publication_year,
			};

			const response: ApiResponse<BookMetadata> = {
				success: true,
				data: metadata,
			};

			res.json(response);
		} catch (error) {
			if ((error as any).name === 'CastError') {
				return next(createInvalidIdError('BOOK'));
			}
			next(createFetchError('FETCH_METADATA', 'book'));
		}
	}
);

/** GET /api/books/metadata - Get metadata for all books */
export const getBooksMetadata = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const filterConfig: Record<string, FilterConfig> = {
			title: { field: 'title', type: 'text' },
			publication_year: { field: 'publication_year', type: 'number' },
			publication_year_min: { field: 'publication_year', type: 'number' },
			publication_year_max: { field: 'publication_year', type: 'number' },
		};
		const filter = buildFilterQuery(req, filterConfig);

		const paginationOptions = getPaginationOptions(req);

		const [books, total] = await Promise.all([
			BookModel.find(filter)
				.select('title blurb characters publication_year')
				.skip(paginationOptions.skip)
				.limit(paginationOptions.limit)
				.sort({ createdAt: -1 }),
			BookModel.countDocuments(filter),
		]);

		const metadata: BookMetadata[] = books.map((book) => ({
			id: book.id,
			title: book.title,
			blurb: book.blurb,
			characters: book.characters.map((id) => id.toString()),
			publication_year: book.publication_year,
		}));

		const response: ApiResponse<PaginatedResponse<BookMetadata>> = {
			success: true,
			data: buildPaginationResult(metadata, total, paginationOptions),
		};

		res.json(response);
	}
);

/** POST /api/books - Create a new book */
export const createBook = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const bookData = req.body;

		try {
			const book = new BookModel(bookData);
			const savedBook = await book.save();

			const response: ApiResponse<IBook> = {
				success: true,
				data: savedBook,
				message: 'Book created successfully',
			};

			res.status(201).json(response);
		} catch (error) {
			if ((error as any).name === 'ValidationError') {
				const messages = Object.values((error as any).errors).map(
					(err: any) => err.message
				);
				return next(createValidationError(messages));
			}
			next(createFetchError('CREATE', 'book'));
		}
	}
);

/** PUT /api/books/:id - Update a book by ID */
export const updateBook = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params;
		const updateData = req.body;

		try {
			const book = await BookModel.findByIdAndUpdate(id, updateData, {
				new: true,
				runValidators: true,
			});

			if (!book) {
				return next(createNotFoundError('BOOK'));
			}

			const response: ApiResponse<IBook> = {
				success: true,
				data: book,
				message: 'Book updated successfully',
			};

			res.json(response);
		} catch (error) {
			if ((error as any).name === 'ValidationError') {
				const messages = Object.values((error as any).errors).map(
					(err: any) => err.message
				);
				return next(createValidationError(messages));
			}
			if ((error as any).name === 'CastError') {
				return next(createInvalidIdError('BOOK'));
			}
			next(createFetchError('UPDATE', 'book'));
		}
	}
);

/** DELETE /api/books/:id - Delete a book by ID */
export const deleteBook = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params;

		try {
			const book = await BookModel.findByIdAndDelete(id);

			if (!book) {
				return next(createNotFoundError('BOOK'));
			}

			const response: ApiResponse<null> = {
				success: true,
				message: 'Book deleted successfully',
			};

			res.json(response);
		} catch (error) {
			if ((error as any).name === 'CastError') {
				return next(createInvalidIdError('BOOK'));
			}
			next(createFetchError('DELETE', 'book'));
		}
	}
);
