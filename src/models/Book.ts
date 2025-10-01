import mongoose, { Document, Schema } from 'mongoose';
import { Book } from '../types/index.js';

export interface IBook extends Document, Omit<Book, '_id'> {}

const bookSchema = new Schema<IBook>(
	{
		title: {
			type: String,
			required: true,
			trim: true,
			maxlength: 200,
		},
		blurb: {
			type: String,
			required: true,
			trim: true,
			maxlength: 500,
		},
		pages: {
			type: Number,
			required: true,
		},
		characters: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Character',
			},
		],
		publication_year: {
			type: Number,
			required: true,
		},
	},
	{
		timestamps: true,
		collection: 'books',
	}
);

bookSchema.index({ title: 1 });
bookSchema.index({ publication_year: -1 });
bookSchema.index({ characters: 1 });

const BookModel = mongoose.model<IBook>('Book', bookSchema);

export default BookModel;
