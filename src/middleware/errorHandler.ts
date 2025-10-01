import { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../types/index.js';

export type AppError = {
	name: string;
	message: string;
	statusCode: number;
	isOperational: boolean;
	stack?: string;
};

// Factory function to create app errors
export const createAppError = (
	message: string,
	statusCode: number = 500,
	isOperational: boolean = true
): AppError => {
	const error = new Error(message) as any;
	error.name = 'AppError';
	error.statusCode = statusCode;
	error.isOperational = isOperational;
	Error.captureStackTrace(error);
	return error as AppError;
};

// App
export const isAppError = (error: any): error is AppError => {
	return error && typeof error === 'object' && error.name === 'AppError';
};

// Mongoose
export const isValidationError = (error: any): boolean => {
	return error && error.name === 'ValidationError';
};

export const isCastError = (error: any): boolean => {
	return error && error.name === 'CastError';
};

export const isDuplicateKeyError = (error: any): boolean => {
	return error && error.name === 'MongoError' && error.code === 11000;
};

export const errorHandler = (
	error: Error,
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	let statusCode = 500;
	let message = 'Internal Server Error';
	let isOperational = false;

	if (isAppError(error)) {
		statusCode = error.statusCode;
		message = error.message;
		isOperational = error.isOperational;
	} else if (isValidationError(error)) {
		statusCode = 400;
		message = 'Validation Error';
	} else if (isCastError(error)) {
		statusCode = 400;
		message = 'Invalid ID format';
	} else if (isDuplicateKeyError(error)) {
		statusCode = 409;
		message = 'Duplicate entry';
	}

	const response: ApiResponse<null> = {
		success: false,
		error: message,
	};

	// Log error for debugging (only operational errors in production)
	if (!isOperational) {
		console.error('Unexpected Error:', {
			message: error.message,
			stack: error.stack,
			url: req.url,
			method: req.method,
		});
	}

	res.status(statusCode).json(response);
};
