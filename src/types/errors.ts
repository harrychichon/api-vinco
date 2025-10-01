export const ERROR_MESSAGES = {
	INVALID_ID: (entity: string) => `Invalid ${entity} ID`,
	NOT_FOUND: (entity: string) => `${entity} not found`,
	FETCH_ALL: (entities: string) => `Failed to fetch ${entities}`,
	FETCH_ONE: (entity: string) => `Failed to fetch ${entity}`,
	FETCH_METADATA: (entity: string) => `Failed to fetch ${entity} metadata`,
	FETCH_ALL_METADATA: (entities: string) =>
		`Failed to fetch ${entities} metadata`,
	CREATE: (entity: string) => `Failed to create ${entity}`,
	UPDATE: (entity: string) => `Failed to update ${entity}`,
	DELETE: (entity: string) => `Failed to delete ${entity}`,

	ENTITIES: {
		BOOK: { singular: 'book', plural: 'books' },
		CHARACTER: { singular: 'character', plural: 'characters' },
		POI: { singular: 'point of interest', plural: 'points of interest' },
		SPECIES: { singular: 'species', plural: 'species' },
	} as const,
} as const;
