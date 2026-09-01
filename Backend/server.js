import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import structuresRoutes from './routes/structures.routes.js';
import sensorsRoutes from './routes/sensors.routes.js';
import alertsRoutes from './routes/alerts.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import kanbanRoutes from './routes/kanban.routes.js';
import inspectionsRoutes from './routes/inspections.routes.js';
import notificationsRoutes from './routes/notifications.routes.js';
import publicRoutes from './routes/public.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { setupSocketHandler } from './socket/socketHandler.js';
import { startAiJobs } from './services/anomalyDetection.service.js';
import { startDataIngestion } from './services/dataIngestion.service.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Store io instance on app for use in controllers
app.set('io', io);

// ── Middleware ──
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// ── Routes ──
app.use('/api/auth', authRoutes);
app.use('/api/structures', structuresRoutes);
app.use('/api/sensors', sensorsRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/kanban', kanbanRoutes);
app.use('/api/inspections', inspectionsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/public', publicRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'StructureAI API is running', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error handler
app.use(errorHandler);

// ── Database & Server ──
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/structureai';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('📦 Connected to MongoDB');

    // Setup Socket.IO handlers
    setupSocketHandler(io);
    startAiJobs();
    startDataIngestion(app);

    httpServer.listen(PORT, () => {
      console.log(`\n🚀 StructureAI Backend running on http://localhost:${PORT}`);
      console.log(`📡 WebSocket ready on ws://localhost:${PORT}`);
      console.log(`🔗 API: http://localhost:${PORT}/api\n`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

export default app;
