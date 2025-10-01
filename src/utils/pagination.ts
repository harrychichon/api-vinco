import { Request } from 'express';

export interface PaginationOptions {
	page: number;
	limit: number;
	skip: number;
}

export interface PaginationResult<T> {
	data: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

/**
 * Extracts and validates pagination parameters from request
 */
export const getPaginationOptions = (req: Request): PaginationOptions => {
	const page = Math.max(1, parseInt(req.query.page as string) || 1);
	const limit = Math.max(1, parseInt(req.query.limit as string) || 10);
	const skip = (page - 1) * limit;

	return { page, limit, skip };
};

/**
 * Builds pagination metadata for API responses
 */
export const buildPaginationResult = <T>(
	data: T[],
	total: number,
	options: PaginationOptions
): PaginationResult<T> => {
	const { page, limit } = options;
	const totalPages = Math.ceil(total / limit);

	return {
		data,
		total,
		page,
		limit,
		totalPages,
	};
};
