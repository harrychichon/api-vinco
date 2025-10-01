import mongoose, { Document, Schema } from 'mongoose';
import { Species } from '../types/index.js';

export interface ISpecies extends Document, Omit<Species, '_id'> {}

const speciesSchema = new Schema<ISpecies>(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		desc: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{
		timestamps: true,
		collection: 'species',
	}
);

speciesSchema.index({ name: 1 });

const SpeciesModel = mongoose.model<ISpecies>('Species', speciesSchema);

export default SpeciesModel;
