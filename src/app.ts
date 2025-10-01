import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { getDatabaseConnectionStatus } from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import bookRoutes from './routes/books.js';
import characterRoutes from './routes/characters.js';
import poiRoutes from './routes/pois.js';
import speciesRoutes from './routes/species.js';

config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Health check endpoint
app.get('/health', (req, res) => {
	res.json({
		status: 'OK',
		timestamp: new Date().toISOString(),
		database: getDatabaseConnectionStatus() ? 'connected' : 'disconnected',
	});
});

// API routes
app.use('/api/books', bookRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/pois', poiRoutes);
app.use('/api/species', speciesRoutes);

// 404 handler
app.use('*', (req, res) => {
	res.status(404).json({
		success: false,
		error: 'Route not found',
	});
});

app.use(errorHandler);

export default app;
