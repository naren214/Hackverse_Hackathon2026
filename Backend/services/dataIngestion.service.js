import { connectors } from './connectors/index.js';
import { computeRiskScore } from './riskScoring.service.js';
import Structure from '../models/Structure.js';
import Sensor from '../models/Sensor.js';
import Alert from '../models/Alert.js';

export const startDataIngestion = (app) => {
  console.log('🌍 Starting Real-World Data Ingestion Service...');
  const io = app.get('io');

  connectors.forEach(connector => {
    console.log(`🔌 Registered connector: ${connector.name} (interval: ${connector.intervalMs}ms)`);
    
    const runConnector = async () => {
      try {
        const structures = await Structure.find();
        
        for (const structure of structures) {
          if (!structure.location || !structure.location.lat) continue;

          try {
            const data = await connector.fetch(structure);
            if (!data) continue; // No data returned

            // Accumulate real inputs for scoring
            // We'll store recent inputs on the structure document or locally
            // For simplicity in this orchestrated cycle, we fetch current state of weather & seismic if available.
            // But since connectors run async on different schedules, we'll cache them in memory per structure
            if (!global.realInputsCache) global.realInputsCache = {};
            if (!global.realInputsCache[structure._id]) global.realInputsCache[structure._id] = {};
            
            // Map connector data to domain model
            if (connector.name === 'osm-structures') {
              structure.name = data.name;
              structure.location.lat = data.lat;
              structure.location.lng = data.lng;
              structure.type = data.type;
              await structure.save();
              console.log(`[OSM] Updated structure ${structure._id} with real OSM identity.`);
            } else if (connector.name === 'open-meteo-weather') {
              global.realInputsCache[structure._id].weather = data;
              
              // Find or create environmental sensors
              await updateOrCreateSensor(structure, 'Temperature', 'temperature', data.temperature, '°C');
              await updateOrCreateSensor(structure, 'Humidity', 'humidity', data.humidity, '%');
              
              // Check weather thresholds for alerts
              if (data.windSpeed > 60) {
                await triggerAlert(io, structure, 'High wind speed detected', 'warning');
              }
            } else if (connector.name === 'usgs-seismic') {
              global.realInputsCache[structure._id].seismic = data;
              
              // Trigger Alert if significant quake nearby
              if (data.magnitude > 4.0 && data.distanceKm < 100) {
                await triggerAlert(io, structure, `Seismic activity: Mag ${data.magnitude} at ${Math.round(data.distanceKm)}km`, 'critical');
                // Create a vibration spike
                await updateOrCreateSensor(structure, 'Seismic Vibration', 'vibration', data.magnitude * 10, 'mm/s');
              }
            }

            // Recompute Risk Score
            const { score, status, reasons } = computeRiskScore(structure, global.realInputsCache[structure._id]);
            
            if (structure.healthScore !== score || structure.status !== status) {
              structure.healthScore = score;
              structure.status = status;
              await structure.save();
              console.log(`[RiskScoring] Structure ${structure.name} healthScore -> ${score} (${status}) | Reasons: ${reasons.join(', ')}`);
            }
          } catch (err) {
            console.error(`Error processing connector ${connector.name} for structure ${structure._id}:`, err.message);
          }
        }
      } catch (err) {
        console.error(`Connector ${connector.name} cycle failed:`, err);
      }
    };

    // Run immediately, then on interval
    runConnector();
    setInterval(runConnector, connector.intervalMs);
  });
};

async function updateOrCreateSensor(structure, name, type, value, unit) {
  let sensor = await Sensor.findOne({ structureId: structure._id, type });
  const time = new Date().toISOString();
  const historyPoint = { time, value };

  if (!sensor) {
    sensor = new Sensor({
      structureId: structure._id,
      structureName: structure.name,
      name,
      type,
      status: 'online',
      value,
      unit,
      battery: 100,
      lastReading: time,
      history: [historyPoint],
      threshold: { min: -50, max: 150 },
      position: { x: 0, y: 0, z: 0 },
      installDate: new Date()
    });
  } else {
    sensor.value = value;
    sensor.lastReading = time;
    sensor.history.push(historyPoint);
    if (sensor.history.length > 24) sensor.history.shift();
  }
  await sensor.save();
}

async function triggerAlert(io, structure, message, severity) {
  // Prevent spamming the exact same alert
  const existing = await Alert.findOne({ 
    structureId: structure._id, 
    message, 
    status: { $ne: 'resolved' } 
  });
  
  if (!existing) {
    const alert = await Alert.create({
      structureId: structure._id,
      structureName: structure.name,
      sensorId: structure._id,
      sensorName: 'Environmental Monitor',
      severity,
      message,
      timestamp: new Date(),
      status: 'new'
    });

    if (io) {
      io.emit('alert:new', alert);
      
      // Also emit a notification shape for the TopBar
      io.emit('notification:new', {
        id: `n_${Date.now()}`,
        title: `Alert: ${severity.toUpperCase()}`,
        message,
        type: 'alert',
        timestamp: new Date().toISOString(),
        read: false
      });
    }
  }
}
