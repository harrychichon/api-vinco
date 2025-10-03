import { NextFunction, Request, Response } from 'express';
import CharacterModel, { ICharacter } from '../models/Character.js';
import {
	ApiResponse,
	CharacterBookStats,
	PaginatedResponse,
	SpeciesStats,
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

/** GET /api/characters - Get all characters with pagination and filters */
export const getAllCharacters = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const filterConfig: Record<string, FilterConfig> = {
			name: { field: 'name', type: 'text' },
			species: { field: 'species', type: 'array' },
		};
		const filter = buildFilterQuery(req, filterConfig);

		const paginationOptions = getPaginationOptions(req);

		const [characters, total] = await Promise.all([
			CharacterModel.find(filter)
				.skip(paginationOptions.skip)
				.limit(paginationOptions.limit)
				.sort({ createdAt: -1 }),
			CharacterModel.countDocuments(filter),
		]);

		const response: ApiResponse<PaginatedResponse<ICharacter>> = {
			success: true,
			data: buildPaginationResult(characters, total, paginationOptions),
		};

		res.json(response);
	}
);

/** GET /api/characters/:id - Get a single character by ID */
export const getCharacterById = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params;

		try {
			const character = await CharacterModel.findById(id);

			if (!character) {
				return next(createNotFoundError('CHARACTER'));
			}

			const response: ApiResponse<ICharacter> = {
				success: true,
				data: character,
			};

			res.json(response);
		} catch (error) {
			if ((error as any).name === 'CastError') {
				return next(createInvalidIdError('CHARACTER'));
			}
			next(createFetchError('FETCH_ONE', 'character'));
		}
	}
);

/** POST /api/characters - Create a new character */
export const createCharacter = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const characterData = req.body;

		try {
			const character = new CharacterModel(characterData);
			const savedCharacter = await character.save();

			const response: ApiResponse<ICharacter> = {
				success: true,
				data: savedCharacter,
				message: 'Character created successfully',
			};

			res.status(201).json(response);
		} catch (error) {
			if ((error as any).name === 'ValidationError') {
				const messages = Object.values((error as any).errors).map(
					(err: any) => err.message
				);
				return next(createValidationError(messages));
			}
			next(createFetchError('CREATE', 'character'));
		}
	}
);

/** PUT /api/characters/:id - Update a character by ID */
export const updateCharacter = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params;
		const updateData = req.body;

		try {
			const character = await CharacterModel.findByIdAndUpdate(id, updateData, {
				new: true,
				runValidators: true,
			});

			if (!character) {
				return next(createNotFoundError('CHARACTER'));
			}

			const response: ApiResponse<ICharacter> = {
				success: true,
				data: character,
				message: 'Character updated successfully',
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
				return next(createInvalidIdError('CHARACTER'));
			}
			next(createFetchError('UPDATE', 'character'));
		}
	}
);

/** DELETE /api/characters/:id - Delete a character by ID */
export const deleteCharacter = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params;

		try {
			const character = await CharacterModel.findByIdAndDelete(id);

			if (!character) {
				return next(createNotFoundError('CHARACTER'));
			}

			const response: ApiResponse<null> = {
				success: true,
				message: 'Character deleted successfully',
			};

			res.json(response);
		} catch (error) {
			if ((error as any).name === 'CastError') {
				return next(createInvalidIdError('CHARACTER'));
			}
			next(createFetchError('DELETE', 'character'));
		}
	}
);

/** GET /api/characters/stats/species - Get character count by species */
export const getCharacterCountBySpecies = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const speciesStats = await CharacterModel.aggregate([
				{
					$group: {
						_id: '$species',
						count: { $sum: 1 },
					},
				},
				{
					$lookup: {
						from: 'species',
						localField: '_id',
						foreignField: '_id',
						as: 'speciesInfo',
					},
				},
				{
					$project: {
						species: { $arrayElemAt: ['$speciesInfo.name', 0] },
						count: 1,
					},
				},
				{
					$sort: { count: -1 },
				},
			]);

			const response: ApiResponse<SpeciesStats[]> = {
				success: true,
				data: speciesStats.map((item) => ({
					species: item.species || 'Unknown',
					count: item.count,
				})),
			};

			res.json(response);
		} catch (error) {
			next(createFetchError('FETCH_ALL', 'character species statistics'));
		}
	}
);

/** GET /api/characters/:id/book-stats - Get book statistics for a character */
export const getCharacterBookStats = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params;

		try {
			// Find the character and populate their books
			const character = await CharacterModel.findById(id)
				.populate('appears_in', 'title characters')
				.select('name appears_in');

			if (!character) {
				return next(createNotFoundError('CHARACTER'));
			}

			// Calculate stats from the populated books
			const books = character.appears_in as any[];
			const bookStats = books.map((book: any) => ({
				bookId: book._id.toString(),
				title: book.title,
				characterCount: book.characters.length,
			}));

			const stats = {
				characterId: (character._id as string).toString(),
				characterName: character.name,
				totalBooks: books.length,
				books: bookStats,
			};

			const response: ApiResponse<CharacterBookStats> = {
				success: true,
				data: stats,
			};

			res.json(response);
		} catch (error) {
			if ((error as any).name === 'CastError') {
				return next(createInvalidIdError('CHARACTER'));
			}
			next(createFetchError('FETCH_ONE', 'character book statistics'));
		}
	}
);
