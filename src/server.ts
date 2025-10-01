import app from './app.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, async () => {
	try {
		// Connect to database
		await connectDatabase();
		console.log(`Server is running on port ${PORT}`);
		console.log(`Health check available at http://localhost:${PORT}/health`);
	} catch (error) {
		console.error('Failed to start server:', error);
		process.exit(1);
	}
});

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
	console.log(`Received ${signal}. Starting graceful shutdown...`);

	try {
		server.close(async () => {
			console.log('HTTP server closed');

			await disconnectDatabase();

			console.log('Graceful shutdown completed');
			process.exit(0);
		});

		setTimeout(() => {
			console.error('Forced shutdown after timeout');
			process.exit(1);
		}, 10000);
	} catch (error) {
		console.error('Error during graceful shutdown:', error);
		process.exit(1);
	}
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
	console.error('Uncaught Exception:', error);
	gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
	gracefulShutdown('unhandledRejection');
});
