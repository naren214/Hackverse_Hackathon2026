import { Router } from 'express';
import Structure from '../models/Structure.js';
import Alert from '../models/Alert.js';
import mongoose from 'mongoose';

const router = Router();

// Minimal public Structure schema for safety
const getPublicStatus = (healthScore) => {
  if (healthScore >= 80) return 'Good';
  if (healthScore >= 60) return 'Fair';
  return 'Needs Attention';
};

router.get('/structures', async (req, res, next) => {
  try {
    const structures = await Structure.find({ publicVisible: { $ne: false } }).lean();
    const publicStructures = structures.map(s => ({
      id: s._id,
      name: s.name,
      type: s.type,
      location: s.location,
      status: getPublicStatus(s.healthScore),
      lastInspection: s.lastInspection,
      nextInspection: s.nextInspection
    }));
    res.json({ success: true, data: publicStructures });
  } catch (error) {
    next(error);
  }
});

router.get('/structures/:id', async (req, res, next) => {
  try {
    const s = await Structure.findOne({ _id: req.params.id, publicVisible: { $ne: false } }).lean();
    if (!s) return res.status(404).json({ success: false, message: 'Structure not found' });
    
    const publicData = {
      id: s._id,
      name: s.name,
      type: s.type,
      location: s.location,
      status: getPublicStatus(s.healthScore),
      lastInspection: s.lastInspection,
      nextInspection: s.nextInspection,
      buildYear: s.buildYear,
      material: s.material,
      length: s.length,
      spans: s.spans
    };
    res.json({ success: true, data: publicData });
  } catch (error) {
    next(error);
  }
});

// A lightweight model for Public requests
const publicRequestSchema = new mongoose.Schema({
  structureId: String,
  timestamp: { type: Date, default: Date.now },
  contactEmail: String
});
const PublicRequest = mongoose.models.PublicRequest || mongoose.model('PublicRequest', publicRequestSchema);

router.get('/structures/:id/inspection-status', async (req, res, next) => {
  try {
    const Inspection = mongoose.models.Inspection || (await import('../models/Inspection.js')).default;
    const scheduled = await Inspection.findOne({ structureId: req.params.id, status: 'scheduled' }).sort({ date: 1 });
    
    if (scheduled) {
      res.json({ success: true, data: { scheduled: true, date: scheduled.date } });
    } else {
      // Log the request
      await PublicRequest.create({ structureId: req.params.id });
      
      const structure = await Structure.findById(req.params.id);
      if (structure) {
        const Notification = (await import('../models/Notification.js')).default;
        const KanbanTask = mongoose.models.KanbanTask || (await import('../models/KanbanTask.js')).default;
        
        const requestCount = await PublicRequest.countDocuments({ structureId: req.params.id });
        const io = req.app.get('io');
        
        if (requestCount >= 100) {
          // Escalate: Create an Inspection
          const Inspection = mongoose.models.Inspection || (await import('../models/Inspection.js')).default;
          const scheduledDate = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours out
          
          await Inspection.create({
            structureId: structure._id,
            structureName: structure.name,
            date: scheduledDate,
            inspector: 'Unassigned',
            type: 'scheduled',
            compliance: 'review',
            severity: 'moderate',
            duration: '4h',
            notes: 'Auto-scheduled due to high public demand.',
            status: 'scheduled'
          });

          // Escalate Kanban Task
          let task = await KanbanTask.findOne({ structureId: structure._id, title: { $regex: /Public Inspection Request/i } });
          if (task) {
            task.priority = 'high';
            task.status = 'in-progress';
            await task.save();
          } else {
            await KanbanTask.create({
              title: `Public Inspection Request: ${structure.name}`,
              description: `Escalated: 100+ public requests for ${structure.name}.`,
              structureId: structure._id,
              structureName: structure.name,
              priority: 'high',
              status: 'in-progress',
              assignee: { name: 'Unassigned', avatar: 'https://ui-avatars.com/api/?name=U', role: 'Pending' },
              dueDate: scheduledDate
            });
          }

          // Create Alert Notification
          const notification = await Notification.create({
            id: `n_${Date.now()}`,
            title: 'Public Demand Escalation',
            message: `Public demand threshold reached for ${structure.name} — inspection auto-scheduled for ${scheduledDate.toLocaleDateString()}.`,
            type: 'alert'
          });
          
          if (io) io.emit('notification:new', notification);

          return res.json({ success: true, data: { scheduled: false, date: scheduledDate, escalated: true, requestCount } });
        } else {
          // Standard tracking
          const KanbanTask = mongoose.models.KanbanTask || (await import('../models/KanbanTask.js')).default;
          await KanbanTask.create({
            title: `Public Inspection Request: ${structure.name}`,
            description: `A citizen has requested an inspection for ${structure.name} via the public portal.`,
            structureId: structure._id,
            structureName: structure.name,
            priority: 'medium',
            status: 'backlog',
            assignee: {
              name: 'Unassigned',
              avatar: 'https://ui-avatars.com/api/?name=U',
              role: 'Pending'
            },
            dueDate: new Date(Date.now() + 7 * 86400000) // 7 days from now
          });

          // Create Info Notification
          const notification = await Notification.create({
            id: `n_${Date.now()}`,
            title: 'Public Inspection Request',
            message: `A citizen requested an inspection for ${structure.name}.`,
            type: 'info'
          });

          if (io) io.emit('notification:new', notification);
        }
      }
      
      const count = await PublicRequest.countDocuments({ structureId: req.params.id });
      res.json({ success: true, data: { scheduled: false, escalated: false, requestCount: count } });
    }
  } catch (error) {
    next(error);
  }
});

router.get('/alerts', async (req, res, next) => {
  try {
    const alerts = await Alert.find({ severity: 'info', status: 'active' }).lean(); // Only safe info alerts
    res.json({ success: true, data: alerts });
  } catch (error) {
    next(error);
  }
});

export default router;
