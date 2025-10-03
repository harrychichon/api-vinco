import { NextFunction, Request, Response } from 'express';
import PoiModel, { IPoi } from '../models/Poi.js';
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

/** GET /api/pois - Get all points of interest with pagination and filters */
export const getAllPois = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const filterConfig: Record<string, FilterConfig> = {
			name: { field: 'name', type: 'text' },
			type: { field: 'type', type: 'text' },
		};
		const filter = buildFilterQuery(req, filterConfig);

		const paginationOptions = getPaginationOptions(req);

		const [pois, total] = await Promise.all([
			PoiModel.find(filter)
				.skip(paginationOptions.skip)
				.limit(paginationOptions.limit)
				.sort({ createdAt: -1 }),
			PoiModel.countDocuments(filter),
		]);

		const response: ApiResponse<PaginatedResponse<IPoi>> = {
			success: true,
			data: buildPaginationResult(pois, total, paginationOptions),
		};

		res.json(response);
	}
);

/** GET /api/pois/:id - Get a single point of interest by ID */
export const getPoiById = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params;

		try {
			const poi = await PoiModel.findById(id);

			if (!poi) {
				return next(createNotFoundError('POI'));
			}

			const response: ApiResponse<IPoi> = {
				success: true,
				data: poi,
			};

			res.json(response);
		} catch (error) {
			if ((error as any).name === 'CastError') {
				return next(createInvalidIdError('POI'));
			}
			next(createFetchError('FETCH_ONE', 'point of interest'));
		}
	}
);

/** POST /api/pois - Create a new point of interest */
export const createPoi = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const poiData = req.body;

		try {
			const poi = new PoiModel(poiData);
			const savedPoi = await poi.save();

			const response: ApiResponse<IPoi> = {
				success: true,
				data: savedPoi,
				message: 'Point of interest created successfully',
			};

			res.status(201).json(response);
		} catch (error) {
			if ((error as any).name === 'ValidationError') {
				const messages = Object.values((error as any).errors).map(
					(err: any) => err.message
				);
				return next(createValidationError(messages));
			}
			next(createFetchError('CREATE', 'point of interest'));
		}
	}
);

/** PUT /api/pois/:id - Update a point of interest by ID */
export const updatePoi = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params;
		const updateData = req.body;

		try {
			const poi = await PoiModel.findByIdAndUpdate(id, updateData, {
				new: true,
				runValidators: true,
			});

			if (!poi) {
				return next(createNotFoundError('POI'));
			}

			const response: ApiResponse<IPoi> = {
				success: true,
				data: poi,
				message: 'Point of interest updated successfully',
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
				return next(createInvalidIdError('POI'));
			}
			next(createFetchError('UPDATE', 'point of interest'));
		}
	}
);

/** DELETE /api/pois/:id - Delete a point of interest by ID */
export const deletePoi = asyncHandler(
	async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params;

		try {
			const poi = await PoiModel.findByIdAndDelete(id);

			if (!poi) {
				return next(createNotFoundError('POI'));
			}

			const response: ApiResponse<null> = {
				success: true,
				message: 'Point of interest deleted successfully',
			};

			res.json(response);
		} catch (error) {
			if ((error as any).name === 'CastError') {
				return next(createInvalidIdError('POI'));
			}
			next(createFetchError('DELETE', 'point of interest'));
		}
	}
);
