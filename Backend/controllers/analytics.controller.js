import Prediction from '../models/Prediction.js';
import Anomaly from '../models/Anomaly.js';
import CostForecast from '../models/CostForecast.js';
import ModelMetrics from '../models/ModelMetrics.js';
import Structure from '../models/Structure.js';
import Sensor from '../models/Sensor.js';
import Alert from '../models/Alert.js';

export const getPredictions = async (req, res, next) => {
  try {
    const { range } = req.query;
    let cutoff = new Date();
    
    if (range === '1m') cutoff.setMonth(cutoff.getMonth() - 1);
    else if (range === '3m') cutoff.setMonth(cutoff.getMonth() - 3);
    else if (range === '6m') cutoff.setMonth(cutoff.getMonth() - 6);
    else if (range === '1y') cutoff.setFullYear(cutoff.getFullYear() - 1);
    else cutoff.setMonth(cutoff.getMonth() - 6); // default 6m

    const predictions = await Prediction.find({ date: { $gte: cutoff } }).sort({ date: 1 });
    res.json({ success: true, data: predictions });
  } catch (error) {
    next(error);
  }
};

export const getAnomalies = async (req, res, next) => {
  try {
    const { range } = req.query;
    let cutoff = new Date();
    if (range === '1m') cutoff.setMonth(cutoff.getMonth() - 1);
    else if (range === '3m') cutoff.setMonth(cutoff.getMonth() - 3);
    else if (range === '6m') cutoff.setMonth(cutoff.getMonth() - 6);
    else if (range === '1y') cutoff.setFullYear(cutoff.getFullYear() - 1);
    else cutoff.setMonth(cutoff.getMonth() - 6);

    const anomalies = await Anomaly.find({ date: { $gte: cutoff } }).sort({ date: -1 });
    res.json({ success: true, data: anomalies });
  } catch (error) {
    next(error);
  }
};

export const getCostForecasts = async (req, res, next) => {
  try {
    const { range } = req.query;
    let cutoff = new Date();
    if (range === '1m') cutoff.setMonth(cutoff.getMonth() - 1);
    else if (range === '3m') cutoff.setMonth(cutoff.getMonth() - 3);
    else if (range === '6m') cutoff.setMonth(cutoff.getMonth() - 6);
    else if (range === '1y') cutoff.setFullYear(cutoff.getFullYear() - 1);
    else cutoff.setMonth(cutoff.getMonth() - 6);

    const forecasts = await CostForecast.find({ month: { $gte: cutoff.toISOString().slice(0,7) } }).sort({ month: 1 });
    res.json({ success: true, data: forecasts });
  } catch (error) {
    next(error);
  }
};

export const getModelMetrics = async (req, res, next) => {
  try {
    const metrics = await ModelMetrics.find().sort({ name: 1 });
    res.json({ success: true, data: metrics });
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalStructures,
      totalSensors,
      activeSensors,
      criticalAlerts,
      warningAlerts,
      structures
    ] = await Promise.all([
      Structure.countDocuments(),
      Sensor.countDocuments(),
      Sensor.countDocuments({ status: 'online' }),
      Alert.countDocuments({ severity: 'critical', status: { $ne: 'resolved' } }),
      Alert.countDocuments({ severity: 'warning', status: { $ne: 'resolved' } }),
      Structure.find().select('healthScore status name').lean()
    ]);

    const avgHealth = structures.length > 0
      ? Math.round(structures.reduce((sum, s) => sum + s.healthScore, 0) / structures.length)
      : 0;

    const statusCounts = {
      healthy: structures.filter(s => s.status === 'healthy').length,
      warning: structures.filter(s => s.status === 'warning').length,
      critical: structures.filter(s => s.status === 'critical').length,
      offline: structures.filter(s => s.status === 'offline').length
    };

    res.json({
      success: true,
      data: {
        totalStructures,
        totalSensors,
        activeSensors,
        criticalAlerts,
        warningAlerts,
        avgHealth,
        statusCounts
      }
    });
  } catch (error) {
    next(error);
  }
};
