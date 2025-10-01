import mongoose from 'mongoose';

export interface Book {
	_id?: string;
	title: string;
	blurb: string;
	pages: number;
	publication_year: number;
	createdAt?: Date;
	updatedAt?: Date;
	characters: mongoose.Types.ObjectId[];
}

export interface Character {
	_id?: string;
	name: string;
	age: number;
	species: mongoose.Types.ObjectId;
	appears_in: mongoose.Types.ObjectId[];
	desc?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface Poi {
	_id?: string;
	name?: string;
	desc?: string;
	type?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface Species {
	_id?: string;
	name: string;
	desc: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface BookMetadata {
	id: string;
	title: string;
	blurb: string;
	characters: string[];
	publication_year: number;
}

export interface SpeciesStats {
	species: string;
	count: number;
}

export interface CharacterBookStats {
	characterId: string;
	characterName: string;
	totalBooks: number;
	books: Array<{
		bookId: string;
		title: string;
		characterCount: number;
	}>;
}

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
	message?: string;
}

export interface PaginationOptions {
	page: number;
	limit: number;
}

export interface PaginatedResponse<T> {
	data: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}
