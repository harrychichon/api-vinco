import { createAppError } from '../middleware/errorHandler.js';
import { ERROR_MESSAGES } from '../types/errors.js';

/** */
/**
 * Creates a "not found" error for a specific entity
 */
export const createNotFoundError = (entity: string) => {
	return createAppError(ERROR_MESSAGES.NOT_FOUND(entity), 404);
};

/**
 * Creates an invalid ID error for a specific entity
 */
export const createInvalidIdError = (entity: string) => {
	return createAppError(ERROR_MESSAGES.INVALID_ID(entity), 400);
};

/**
 * Creates a fetch error for a specific operation
 */
export const createFetchError = (
	operation: keyof typeof ERROR_MESSAGES,
	entity: string
) => {
	const messageFn = ERROR_MESSAGES[operation];
	if (typeof messageFn === 'function') {
		return createAppError(messageFn(entity), 500);
	}
	return createAppError('Unknown error', 500);
};

/**
 * Creates a validation error with custom messages
 */
export const createValidationError = (messages: string[]) => {
	return createAppError(`Validation Error: ${messages.join(', ')}`, 400);
};
