const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { connectDatabase, closeDatabase } = require('./config/database');
const config = require('./config/config');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const preferencesRoutes = require('./routes/preferences');
const documentsRoutes = require('./routes/documents');
const analyticsRoutes = require('./routes/analytics');

// Initialize Express app
const app = express();

// Connect to database lazily (per-request caching) - required for Vercel serverless
const dbConnect = async () => {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState >= 1) return; // Already connected
    await connectDatabase();
};

// Middleware: ensure DB is connected before processing API routes
app.use(async (req, res, next) => {
    // Only connect for API routes, not static files
    if (req.path.startsWith('/auth') || req.path.startsWith('/user') ||
        req.path.startsWith('/preferences') || req.path.startsWith('/documents') ||
        req.path.startsWith('/analytics')) {
        try {
            await dbConnect();
        } catch (err) {
            // Log but don't block the request
            logger.error('DB connection middleware error:', err.message);
        }
    }
    next();
});

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false
}));

// CORS configuration
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        if (config.allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (config.nodeEnv === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Rate limiting
const limiter = rateLimit({
    windowMs: config.rateLimitWindowMs,
    max: config.rateLimitMaxRequests,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// API routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/preferences', preferencesRoutes);
app.use('/documents', documentsRoutes);
app.use('/analytics', analyticsRoutes);


// Serve frontend static files (for Vercel deployment)
app.use(express.static(path.join(__dirname, '../frontend')));

// SPA/Fallback: ensure / always serves the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// Serve index.html for any unmatched route (SPA fallback)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Only start the server when running locally (not on Vercel)
if (process.env.VERCEL !== '1') {
    const PORT = config.port;
    const server = app.listen(PORT, () => {
        logger.info(`Server running in ${config.nodeEnv} mode on port ${PORT}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
        logger.info('SIGTERM signal received: closing HTTP server');
        server.close(async () => {
            logger.info('HTTP server closed');
            await closeDatabase();
            process.exit(0);
        });
    });

    process.on('SIGINT', async () => {
        logger.info('SIGINT signal received: closing HTTP server');
        server.close(async () => {
            logger.info('HTTP server closed');
            await closeDatabase();
            process.exit(0);
        });
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
        logger.error('Unhandled Promise Rejection:', err);
        server.close(async () => {
            await closeDatabase();
            process.exit(1);
        });
    });
}

module.exports = app;
