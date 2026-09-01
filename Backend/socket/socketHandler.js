import jwt from 'jsonwebtoken';
import Sensor from '../models/Sensor.js';

function generateRealtimeValue(baseValue, variance) {
  return baseValue + (Math.random() - 0.5) * variance;
}

export function setupSocketHandler(io) {
  // Optional JWT auth for socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.userId;
      } catch (err) {
        // Allow connection without auth for now (demo mode)
      }
    }
    next();
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Subscribe to specific structure sensor updates
    socket.on('sensor:subscribe', (structureId) => {
      socket.join(`structure:${structureId}`);
      console.log(`📡 ${socket.id} subscribed to structure: ${structureId}`);
    });

    socket.on('sensor:unsubscribe', (structureId) => {
      socket.leave(`structure:${structureId}`);
      console.log(`📡 ${socket.id} unsubscribed from structure: ${structureId}`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  // Real-time sensor data broadcast every 3 seconds
  let sensorCache = [];

  const loadSensors = async () => {
    try {
      sensorCache = await Sensor.find({ status: { $ne: 'offline' } }).lean();
    } catch (err) {
      console.error('Failed to load sensors for real-time updates:', err.message);
    }
  };

  // Initial load
  loadSensors();

  // Refresh sensor cache every 30 seconds
  setInterval(loadSensors, 30000);

  // Broadcast sensor updates every 3 seconds
  setInterval(async () => {
    if (sensorCache.length === 0) return;

    const updates = sensorCache.map(sensor => {
      const newValue = generateRealtimeValue(sensor.value, sensor.value * 0.1);
      const reading = { time: new Date().toISOString(), value: newValue };

      return {
        id: sensor._id.toString(),
        structureId: sensor.structureId?.toString(),
        value: newValue,
        lastReading: reading.time,
        newHistoryPoint: reading
      };
    });

    // Broadcast to all connected clients
    io.emit('sensor:update', updates);

    // Also broadcast to structure-specific rooms
    const byStructure = {};
    for (const update of updates) {
      if (!update.structureId) continue;
      if (!byStructure[update.structureId]) byStructure[update.structureId] = [];
      byStructure[update.structureId].push(update);
    }
    for (const [structureId, structureUpdates] of Object.entries(byStructure)) {
      io.to(`structure:${structureId}`).emit('sensor:structure-update', structureUpdates);
    }

    // Periodically update DB values (every 10th cycle ~30s)
    if (Math.random() < 0.1) {
      try {
        const bulkOps = updates.slice(0, 10).map(u => ({
          updateOne: {
            filter: { _id: u.id },
            update: { $set: { value: u.value, lastReading: u.lastReading } }
          }
        }));
        await Sensor.bulkWrite(bulkOps);
      } catch (err) {
        // Non-critical, silently fail
      }
    }
  }, 3000);

  console.log('🔌 Socket.IO handler initialized');
}
