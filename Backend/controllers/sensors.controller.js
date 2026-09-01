import Sensor from '../models/Sensor.js';

export const getSensors = async (req, res, next) => {
  try {
    const { structureId, type, status, search } = req.query;
    const filter = {};

    if (structureId) filter.structureId = structureId;
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const sensors = await Sensor.find(filter).sort({ name: 1 });
    res.json({ success: true, data: sensors });
  } catch (error) {
    next(error);
  }
};

export const getSensor = async (req, res, next) => {
  try {
    const sensor = await Sensor.findById(req.params.id);
    if (!sensor) {
      return res.status(404).json({ success: false, message: 'Sensor not found' });
    }
    res.json({ success: true, data: sensor });
  } catch (error) {
    next(error);
  }
};

export const createSensor = async (req, res, next) => {
  try {
    const sensor = await Sensor.create(req.body);
    res.status(201).json({ success: true, data: sensor });
  } catch (error) {
    next(error);
  }
};

export const updateSensor = async (req, res, next) => {
  try {
    const sensor = await Sensor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!sensor) {
      return res.status(404).json({ success: false, message: 'Sensor not found' });
    }
    res.json({ success: true, data: sensor });
  } catch (error) {
    next(error);
  }
};

export const deleteSensor = async (req, res, next) => {
  try {
    const sensor = await Sensor.findByIdAndDelete(req.params.id);
    if (!sensor) {
      return res.status(404).json({ success: false, message: 'Sensor not found' });
    }
    res.json({ success: true, message: 'Sensor deleted' });
  } catch (error) {
    next(error);
  }
};
