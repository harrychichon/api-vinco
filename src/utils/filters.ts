import { Request } from 'express';

export interface FilterConfig {
	field: string;
	type: 'text' | 'number' | 'array' | 'date' | 'boolean';
}

/**
 * Safely converts query parameter value to string
 */
const getStringValue = (value: any): string => {
	if (typeof value === 'string') return value;
	if (typeof value === 'number') return value.toString();
	if (typeof value === 'boolean') return value.toString();
	return '';
};

/**
 * Builds a MongoDB filter object from query parameters
 */
export const buildFilterQuery = (
	req: Request,
	allowedFilters: Record<string, FilterConfig>
) => {
	const filter: any = {};

	for (const [param, config] of Object.entries(allowedFilters)) {
		const value = req.query[param];
		if (!value) continue;

		switch (config.type) {
			case 'text':
				filter[config.field] = { $regex: getStringValue(value), $options: 'i' };
				break;

			case 'number':
				if (param.endsWith('_min')) {
					filter[config.field] = {
						...filter[config.field],
						$gte: Number(value),
					};
				} else if (param.endsWith('_max')) {
					filter[config.field] = {
						...filter[config.field],
						$lte: Number(value),
					};
				} else {
					filter[config.field] = Number(value);
				}
				break;

			case 'array':
				if (Array.isArray(value)) {
					filter[config.field] = { $in: value };
				} else {
					const ids = getStringValue(value)
						.split(',')
						.filter((id) => id.trim());
					filter[config.field] = { $in: ids };
				}
				break;

			case 'date':
				if (param.endsWith('_from')) {
					filter[config.field] = {
						...filter[config.field],
						$gte: new Date(getStringValue(value)),
					};
				} else if (param.endsWith('_to')) {
					filter[config.field] = {
						...filter[config.field],
						$lte: new Date(getStringValue(value)),
					};
				} else {
					filter[config.field] = new Date(getStringValue(value));
				}
				break;

			case 'boolean':
				filter[config.field] = getStringValue(value).toLowerCase() === 'true';
				break;

			default:
				filter[config.field] = value;
		}
	}

	return filter;
};
