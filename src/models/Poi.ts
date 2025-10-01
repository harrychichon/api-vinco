import mongoose, { Document, Schema } from 'mongoose';
import { Poi } from '../types/index.js';

export interface IPoi extends Document, Omit<Poi, '_id'> {}

const poiSchema = new Schema<IPoi>(
	{
		name: {
			type: String,
			trim: true,
		},
		desc: {
			type: String,
			trim: true,
		},
		type: {
			type: String,
			trim: true,
		},
	},
	{
		timestamps: true,
		collection: 'pois',
	}
);

poiSchema.index({ name: 1 });
poiSchema.index({ type: 1 });

const PoiModel = mongoose.model<IPoi>('Poi', poiSchema);

export default PoiModel;
