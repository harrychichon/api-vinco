import { NextFunction, Request, Response } from 'express';
import SpeciesModel, { ISpecies } from '../models/Species.js';
import { ApiResponse, PaginatedResponse } from '../types/index.js';
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

/** GET /api/species - Get all species with pagination and filters */
export const getAllSpecies = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const filterConfig: Record<string, FilterConfig> = {
			name: { field: 'name', type: 'text' },
		};
		const filter = buildFilterQuery(req, filterConfig);

		const paginationOptions = getPaginationOptions(req);

		const [species, total] = await Promise.all([
			SpeciesModel.find(filter)
				.skip(paginationOptions.skip)
				.limit(paginationOptions.limit)
				.sort({ createdAt: -1 }),
			SpeciesModel.countDocuments(filter),
		]);

		const response: ApiResponse<PaginatedResponse<ISpecies>> = {
			success: true,
			data: buildPaginationResult(species, total, paginationOptions),
		};

		res.json(response);
	}
);
/** GET /api/species/:id - Get a single species by ID */
export const getSpeciesById = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params;

		try {
			const species = await SpeciesModel.findById(id);

			if (!species) {
				return next(createNotFoundError('SPECIES'));
			}

			const response: ApiResponse<ISpecies> = {
				success: true,
				data: species,
			};

			res.json(response);
		} catch (error) {
			if ((error as any).name === 'CastError') {
				return next(createInvalidIdError('SPECIES'));
			}
			next(createFetchError('FETCH_ONE', 'species'));
		}
	}
);

/** POST /api/species - Create a new species */
export const createSpecies = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const speciesData = req.body;

		try {
			const species = new SpeciesModel(speciesData);
			const savedSpecies = await species.save();

			const response: ApiResponse<ISpecies> = {
				success: true,
				data: savedSpecies,
				message: 'Species created successfully',
			};

			res.status(201).json(response);
		} catch (error) {
			if ((error as any).name === 'ValidationError') {
				const messages = Object.values((error as any).errors).map(
					(err: any) => err.message
				);
				return next(createValidationError(messages));
			}
			next(createFetchError('CREATE', 'species'));
		}
	}
);

/** PUT /api/species/:id - Update a species by ID */
export const updateSpecies = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params;
		const updateData = req.body;

		try {
			const species = await SpeciesModel.findByIdAndUpdate(id, updateData, {
				new: true,
				runValidators: true,
			});

			if (!species) {
				return next(createNotFoundError('SPECIES'));
			}

			const response: ApiResponse<ISpecies> = {
				success: true,
				data: species,
				message: 'Species updated successfully',
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
				return next(createInvalidIdError('SPECIES'));
			}
			next(createFetchError('UPDATE', 'species'));
		}
	}
);

/** DELETE /api/species/:id - Delete a species by ID */
export const deleteSpecies = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params;

		try {
			const species = await SpeciesModel.findByIdAndDelete(id);

			if (!species) {
				return next(createNotFoundError('SPECIES'));
			}

			const response: ApiResponse<null> = {
				success: true,
				message: 'Species deleted successfully',
			};

			res.json(response);
		} catch (error) {
			if ((error as any).name === 'CastError') {
				return next(createInvalidIdError('SPECIES'));
			}
			next(createFetchError('DELETE', 'species'));
		}
	}
);
