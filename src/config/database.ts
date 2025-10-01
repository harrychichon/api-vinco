import { config } from 'dotenv';
import mongoose from 'mongoose';

config();

export type DatabaseState = {
	isConnected: boolean;
};

let databaseState: DatabaseState = {
	isConnected: false,
};

export const connectDatabase = async (): Promise<void> => {
	try {
		if (databaseState.isConnected) {
			console.log('MongoDB already connected');
			return;
		}

		const mongoUri = process.env.MONGODB_URI;
		if (!mongoUri) {
			throw new Error('MONGODB_URI environment variable is not set');
		}

		await mongoose.connect(mongoUri);

		databaseState.isConnected = true;
		console.log('MongoDB connected successfully');

		// Handle connection events
		mongoose.connection.on('error', (error) => {
			console.error('MongoDB connection error:', error);
			databaseState.isConnected = false;
		});

		mongoose.connection.on('disconnected', () => {
			console.log('MongoDB disconnected');
			databaseState.isConnected = false;
		});
	} catch (error) {
		console.error('Failed to connect to MongoDB:', error);
		throw error;
	}
};

export const disconnectDatabase = async (): Promise<void> => {
	try {
		await mongoose.connection.close();
		databaseState.isConnected = false;
		console.log('MongoDB disconnected gracefully');
	} catch (error) {
		console.error('Error disconnecting from MongoDB:', error);
		throw error;
	}
};

// Function to get connection status
export const getDatabaseConnectionStatus = (): boolean => {
	return databaseState.isConnected;
};
