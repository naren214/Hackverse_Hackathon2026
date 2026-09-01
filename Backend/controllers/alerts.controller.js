import Alert from '../models/Alert.js';

export const getAlerts = async (req, res, next) => {
  try {
    const { severity, status, structureId, search } = req.query;
    const filter = {};

    if (severity) filter.severity = severity;
    if (status) filter.status = status;
    if (structureId) filter.structureId = structureId;
    if (search) filter.message = { $regex: search, $options: 'i' };

    const alerts = await Alert.find(filter).sort({ timestamp: -1 });
    res.json({ success: true, data: alerts });
  } catch (error) {
    next(error);
  }
};

export const getAlert = async (req, res, next) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }
    res.json({ success: true, data: alert });
  } catch (error) {
    next(error);
  }
};

export const createAlert = async (req, res, next) => {
  try {
    const alert = await Alert.create(req.body);

    // Emit real-time alert via Socket.IO if available
    const io = req.app.get('io');
    if (io) {
      io.emit('alert:new', alert);
    }

    res.status(201).json({ success: true, data: alert });
  } catch (error) {
    next(error);
  }
};

export const updateAlert = async (req, res, next) => {
  try {
    const alert = await Alert.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }
    res.json({ success: true, data: alert });
  } catch (error) {
    next(error);
  }
};

export const deleteAlert = async (req, res, next) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }
    res.json({ success: true, message: 'Alert deleted' });
  } catch (error) {
    next(error);
  }
};
