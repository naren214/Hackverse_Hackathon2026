import Sensor from '../models/Sensor.js';
import Anomaly from '../models/Anomaly.js';
import Prediction from '../models/Prediction.js';
import ModelMetrics from '../models/ModelMetrics.js';
import Structure from '../models/Structure.js';

function randomVariance(value, percent) {
  return value + value * (Math.random() - 0.5) * percent;
}

export const startAiJobs = () => {
  console.log('🤖 Starting AI/ML Simulation Jobs');

  // Run every 60 seconds
  setInterval(async () => {
    try {
      // --- 1. Anomaly Detection ---
      const sensors = await Sensor.find({ status: { $ne: 'offline' } }).lean();
      if (sensors.length > 0) {
        // Pick a random sensor to have an anomaly
        const targetSensor = sensors[Math.floor(Math.random() * sensors.length)];
        const expected = targetSensor.threshold ? (targetSensor.threshold.max + targetSensor.threshold.min) / 2 : targetSensor.value;
        const anomalousValue = expected * (1 + (Math.random() * 0.5 + 0.2)); // 20-70% deviation
        
        await Anomaly.create({
          date: new Date(),
          sensorId: targetSensor._id.toString(),
          sensorName: targetSensor.name,
          structureName: targetSensor.structureName || 'Unknown Structure',
          value: anomalousValue,
          expected: expected,
          severity: anomalousValue > expected * 1.5 ? 'high' : 'medium'
        });
      }

      // --- 2. Predictions ---
      // Generate a new forward-looking prediction point based on a general trend
      const lastPrediction = await Prediction.findOne().sort({ date: -1 });
      const baseValue = lastPrediction ? lastPrediction.predicted : 80;
      const newPredicted = Math.max(0, Math.min(100, randomVariance(baseValue, 0.05)));
      
      await Prediction.create({
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days in future
        predicted: newPredicted,
        confidence: 85 + Math.random() * 10
      });

      // --- 3. Model Metrics Update ---
      // Randomly drift metrics to simulate continuous learning
      const metrics = await ModelMetrics.find();
      for (const model of metrics) {
        model.accuracy = Math.min(99.9, Math.max(80, randomVariance(model.accuracy, 0.01)));
        model.precision = Math.min(99.9, Math.max(80, randomVariance(model.precision, 0.01)));
        model.recall = Math.min(99.9, Math.max(80, randomVariance(model.recall, 0.01)));
        model.f1Score = (2 * model.precision * model.recall) / (model.precision + model.recall);
        model.dataPoints += Math.floor(Math.random() * 100);
        model.lastTrained = new Date();
        await model.save();
      }

    } catch (err) {
      console.error('AI Jobs Error:', err);
    }
  }, 60000);
};
