import mongoose, { Document, Schema } from 'mongoose';
import { Character } from '../types/index.js';

export interface ICharacter extends Document, Omit<Character, '_id'> {}

const characterSchema = new Schema<ICharacter>(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		age: {
			type: Number,
			required: true,
		},
		species: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Species',
		},
		appears_in: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Book',
			},
		],
		desc: {
			type: String,
			trim: true,
			maxlength: 1000,
		},
	},
	{
		timestamps: true,
		collection: 'characters',
	}
);

characterSchema.index({ name: 1 });
characterSchema.index({ species: 1 });
characterSchema.index({ appears_in: 1 });

const CharacterModel = mongoose.model<ICharacter>('Character', characterSchema);

export default CharacterModel;
