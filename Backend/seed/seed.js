import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

import User from '../models/User.js';
import Structure from '../models/Structure.js';
import Sensor from '../models/Sensor.js';
import Alert from '../models/Alert.js';
import KanbanTask from '../models/KanbanTask.js';
import Inspection from '../models/Inspection.js';
import Notification from '../models/Notification.js';
import Prediction from '../models/Prediction.js';
import Anomaly from '../models/Anomaly.js';
import CostForecast from '../models/CostForecast.js';
import ModelMetrics from '../models/ModelMetrics.js';

const now = new Date();
const subDays = (date, days) => new Date(date.getTime() - days * 86400000);
const subHours = (date, hours) => new Date(date.getTime() - hours * 3600000);
const subMinutes = (date, minutes) => new Date(date.getTime() - minutes * 60000);
const addDays = (date, days) => new Date(date.getTime() + days * 86400000);

function generateSparklineData(points, min, max) {
  const data = [];
  let currentValue = (min + max) / 2;
  for (let i = points; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60000);
    const variance = (max - min) * 0.1;
    currentValue += (Math.random() - 0.5) * variance;
    currentValue = Math.min(Math.max(currentValue, min), max);
    data.push({ time: time.toISOString(), value: currentValue });
  }
  return data;
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    // Clear all collections
    await Promise.all([
      User.deleteMany({}),
      Structure.deleteMany({}),
      Sensor.deleteMany({}),
      Alert.deleteMany({}),
      KanbanTask.deleteMany({}),
      Inspection.deleteMany({}),
      Notification.deleteMany({}),
      Prediction.deleteMany({}),
      Anomaly.deleteMany({}),
      CostForecast.deleteMany({}),
      ModelMetrics.deleteMany({})
    ]);
    console.log('🗑️  Cleared all collections');

    // ── Users ──
    await User.create([
      {
        name: 'Aarav Sharma',
        email: 'demo@structureai.com',
        password: 'demo1234',
        role: 'admin',
        avatar: 'https://i.pravatar.cc/150?u=aarav',
        department: 'Operations',
        organization: 'Public Works Department',
        designation: 'Chief Engineer',
        jurisdiction: 'Maharashtra',
        employeeId: 'PWD-MH-001',
        verified: true,
        lastLogin: now
      },
      {
        name: 'Priya Patel',
        email: 'inspector@structureai.com',
        password: 'demo1234',
        role: 'inspector',
        avatar: 'https://i.pravatar.cc/150?u=priya',
        department: 'Field Inspections',
        organization: 'Public Works Department',
        designation: 'Senior Inspector',
        jurisdiction: 'Mumbai',
        employeeId: 'PWD-MH-042',
        verified: true,
        lastLogin: now
      }
    ]);
    console.log('👤 Created government users: demo@structureai.com, inspector@structureai.com (pw: demo1234)');

    // ── Structures ──
    const structuresData = [
      {
        name: 'Howrah Bridge', type: 'bridge',
        location: { lat: 22.5851, lng: 88.3468, address: 'Howrah Bridge', city: 'Kolkata', state: 'West Bengal' },
        healthScore: 92, status: 'healthy', sensorCount: 45, activeSensors: 45,
        lastInspection: subDays(now, 15), nextInspection: addDays(now, 45),
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Howrah_Bridge_Kolkata_India.jpg',
        buildYear: 1943, material: 'Steel', length: 705, spans: 3,
        description: 'Iconic cantilever bridge over the Hooghly River.'
      },
      {
        name: 'Bandra-Worli Sea Link', type: 'bridge',
        location: { lat: 19.0357, lng: 72.8154, address: 'Bandra-Worli Sea Link', city: 'Mumbai', state: 'Maharashtra' },
        healthScore: 74, status: 'warning', sensorCount: 60, activeSensors: 58,
        lastInspection: subDays(now, 30), nextInspection: addDays(now, 15),
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Bandra_Worli_Sea_Link_Mumbai.jpg',
        buildYear: 2009, material: 'Prestressed Concrete-Steel', length: 5600, spans: 50,
        description: 'Cable-stayed bridge linking Bandra to Worli.'
      },
      {
        name: 'Chenab Rail Bridge', type: 'bridge',
        location: { lat: 33.1553, lng: 74.8258, address: 'Bakkal', city: 'Reasi', state: 'J&K' },
        healthScore: 88, status: 'healthy', sensorCount: 120, activeSensors: 118,
        lastInspection: subDays(now, 5), nextInspection: addDays(now, 90),
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Chenab_Bridge.jpg/1024px-Chenab_Bridge.jpg',
        buildYear: 2022, material: 'Steel', length: 1315, spans: 17,
        description: 'Highest railway bridge in the world.'
      },
      {
        name: 'Signature Bridge', type: 'bridge',
        location: { lat: 28.7180, lng: 77.2291, address: 'Wazirabad', city: 'Delhi', state: 'Delhi' },
        healthScore: 45, status: 'critical', sensorCount: 30, activeSensors: 22,
        lastInspection: subDays(now, 2), nextInspection: addDays(now, 5),
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Signature_Bridge_Delhi_2.jpg/1024px-Signature_Bridge_Delhi_2.jpg',
        buildYear: 2018, material: 'Steel-Concrete', length: 675, spans: 5,
        description: 'Cantilever spar cable-stayed bridge over Yamuna river.'
      },
      {
        name: 'Pamban Bridge', type: 'bridge',
        location: { lat: 9.2789, lng: 79.2081, address: 'Pamban', city: 'Rameswaram', state: 'Tamil Nadu' },
        healthScore: 67, status: 'warning', sensorCount: 40, activeSensors: 35,
        lastInspection: subDays(now, 10), nextInspection: addDays(now, 20),
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Pamban_Bridge_India.jpg',
        buildYear: 1914, material: 'Steel', length: 2065, spans: 143,
        description: 'Historic railway bridge connecting Rameswaram.'
      },
      {
        name: 'Vidyasagar Setu', type: 'bridge',
        location: { lat: 22.5562, lng: 88.3283, address: 'Vidyasagar Setu', city: 'Kolkata', state: 'West Bengal' },
        healthScore: 91, status: 'healthy', sensorCount: 50, activeSensors: 50,
        lastInspection: subDays(now, 20), nextInspection: addDays(now, 40),
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Vidyasagar_Setu_Second_Hooghly_Bridge_Kolkata.jpg',
        buildYear: 1992, material: 'Steel', length: 823, spans: 7,
        description: 'Longest cable-stayed bridge in India.'
      },
      {
        name: 'Mahatma Gandhi Setu', type: 'bridge',
        location: { lat: 25.6179, lng: 85.2152, address: 'Ganga River', city: 'Patna', state: 'Bihar' },
        healthScore: 58, status: 'warning', sensorCount: 80, activeSensors: 72,
        lastInspection: subDays(now, 25), nextInspection: addDays(now, 10),
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Mahatma_Gandhi_Setu%2C_Patna.jpg',
        buildYear: 1982, material: 'Concrete-Steel', length: 5750, spans: 46,
        description: 'One of the longest river bridges in India.'
      },
      {
        name: 'Rajiv Gandhi Flyover', type: 'flyover',
        location: { lat: 12.9716, lng: 77.5946, address: 'Madiwala', city: 'Bangalore', state: 'Karnataka' },
        healthScore: 85, status: 'healthy', sensorCount: 20, activeSensors: 20,
        lastInspection: subDays(now, 40), nextInspection: addDays(now, 20),
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Electronic_City_Elevated_Expressway.jpg/1024px-Electronic_City_Elevated_Expressway.jpg',
        buildYear: 2010, material: 'Concrete', length: 9980,
        description: 'Major elevated expressway.'
      },
      {
        name: 'Nehru Government Complex', type: 'building',
        location: { lat: 28.6139, lng: 77.2090, address: 'Central Secretariat', city: 'Delhi', state: 'Delhi' },
        healthScore: 89, status: 'healthy', sensorCount: 75, activeSensors: 75,
        lastInspection: subDays(now, 60), nextInspection: addDays(now, 30),
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/15/North_Block_of_the_Secretariat_Building%2C_New_Delhi.jpg',
        buildYear: 1927, material: 'Stone and Brick',
        description: 'Historic administrative building.'
      },
      {
        name: 'Mumbai Municipal HQ', type: 'building',
        location: { lat: 18.9388, lng: 72.8339, address: 'Mahapalika Marg', city: 'Mumbai', state: 'Maharashtra' },
        healthScore: 72, status: 'warning', sensorCount: 35, activeSensors: 32,
        lastInspection: subDays(now, 12), nextInspection: addDays(now, 18),
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Brihanmumbai_Municipal_Corporation_headquarters.jpg',
        buildYear: 1893, material: 'Stone',
        description: 'Grade IIA heritage building housing the BMC.'
      }
    ];

    const structures = await Structure.insertMany(structuresData);
    console.log(`🏗️  Created ${structures.length} structures`);

    // ── Sensors ──
    const sensorTypes = ['vibration', 'strain', 'temperature', 'displacement', 'tilt', 'humidity', 'corrosion'];
    const sensorsData = [];

    for (let i = 1; i <= 50; i++) {
      const structure = structures[i % 10];
      const type = sensorTypes[i % 7];

      let unit = '', min = 0, max = 100, val = 0;
      if (type === 'vibration') { unit = 'mm/s'; min = 0; max = 50; val = 12 + Math.random() * 5; }
      else if (type === 'strain') { unit = 'µε'; min = 0; max = 1000; val = 300 + Math.random() * 50; }
      else if (type === 'temperature') { unit = '°C'; min = -20; max = 80; val = 25 + Math.random() * 10; }
      else if (type === 'displacement') { unit = 'mm'; min = 0; max = 100; val = 5 + Math.random() * 2; }
      else if (type === 'tilt') { unit = 'deg'; min = 0; max = 90; val = 0.5 + Math.random() * 0.1; }
      else if (type === 'humidity') { unit = '%'; min = 0; max = 100; val = 60 + Math.random() * 20; }
      else if (type === 'corrosion') { unit = 'mm/yr'; min = 0; max = 5; val = 0.1 + Math.random() * 0.2; }

      let status = 'online';
      if (i % 10 === 0) status = 'offline';
      else if (i % 7 === 0) status = 'warning';

      sensorsData.push({
        structureId: structure._id,
        structureName: structure.name,
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} Sensor ${i}`,
        type,
        status,
        value: val,
        unit,
        battery: 60 + Math.random() * 40,
        lastReading: now,
        history: generateSparklineData(24, min, max),
        threshold: { min, max: max * 0.8 },
        position: { x: Math.random() * 10, y: Math.random() * 10, z: Math.random() * 10 },
        installDate: subDays(now, 365 + Math.random() * 365)
      });
    }

    const sensors = await Sensor.insertMany(sensorsData);
    console.log(`📡 Created ${sensors.length} sensors`);

    const alertsData = [
      {
        structureId: structures[3]._id, structureName: 'Signature Bridge',
        sensorId: sensors[0]._id, sensorName: 'Stay Cable Tension Sensor 4',
        severity: 'critical', status: 'new',
        message: 'Tension loss detected in primary stay cable',
        details: 'Cable tension dropped by 14% over 48 hours, likely due to high wind flutter and diurnal temperature variations. Potential anchor slippage.',
        timestamp: subMinutes(now, 15),
        recommendation: 'Immediate visual inspection of cable anchorages and re-tensioning if required.'
      },
      {
        structureId: structures[1]._id, structureName: 'Bandra-Worli Sea Link',
        sensorId: sensors[1]._id, sensorName: 'Pylon Corrosion Monitor',
        severity: 'warning', status: 'acknowledged',
        message: 'Accelerated chloride-induced corrosion',
        details: 'Corrosion rate on Pylon B exceeded 0.8mm/yr. High marine salinity and concrete spalling detected at splash zone.',
        timestamp: subHours(now, 4),
        recommendation: 'Schedule application of silane siloxane protective coating and patch repair.'
      },
      {
        structureId: structures[4]._id, structureName: 'Pamban Bridge',
        sensorId: sensors[2]._id, sensorName: 'Girder Strain Gauge',
        severity: 'critical', status: 'new',
        message: 'Shear stress nearing yield limits during high winds',
        details: 'Sustained cyclonic winds have caused strain readings to exceed 850 µε on cantilever section joints. Severe rust scaling present.',
        timestamp: subMinutes(now, 45),
        recommendation: 'Halt rail traffic immediately and dispatch emergency structural engineering team.'
      },
      {
        structureId: structures[6]._id, structureName: 'Mahatma Gandhi Setu',
        sensorId: sensors[3]._id, sensorName: 'Pier Tilt Sensor',
        severity: 'warning', status: 'new',
        message: 'Abnormal pier tilt detected (Monsoon Scour)',
        details: 'Pier 14 showing 0.6 degree tilt. High flood velocity has likely caused significant riverbed scour around the foundation.',
        timestamp: subHours(now, 12),
        recommendation: 'Conduct bathymetric survey around piers and dump boulders to prevent further scouring.'
      },
      {
        structureId: structures[0]._id, structureName: 'Howrah Bridge',
        sensorId: sensors[4]._id, sensorName: 'Anchor Arm Strain Sensor',
        severity: 'warning', status: 'resolved',
        message: 'Elevated strain on hanger joints',
        details: 'Strain reached 600 µε due to heavy traffic congestion. Heavy surface rust exacerbating joint stiffness.',
        timestamp: subDays(now, 2),
        recommendation: 'Routine lubrication of joints and strict enforcement of heavy vehicle weight limits.'
      },
      {
        structureId: structures[2]._id, structureName: 'Chenab Rail Bridge',
        sensorId: sensors[5]._id, sensorName: 'Arch Temperature Sensor',
        severity: 'info', status: 'resolved',
        message: 'Thermal expansion limits reached',
        details: 'Extreme diurnal temperature variation (-5°C to 20°C) caused steel arch to expand to upper tolerance limit. Expansion joints functioning normally.',
        timestamp: subDays(now, 5),
        recommendation: 'Monitor expansion joint clearance during seasonal peaks.'
      }
    ];

    const alerts = await Alert.insertMany(alertsData);
    console.log(`🚨 Created ${alerts.length} alerts`);

    // ── Kanban Tasks ──
    const kanbanData = [
      {
        title: 'Replace corroded bolts', description: 'Replace bolts on Span 4 of Howrah Bridge',
        structureId: structures[0]._id, structureName: 'Howrah Bridge',
        priority: 'high', status: 'backlog',
        assignee: { name: 'Rahul Desai', avatar: 'https://i.pravatar.cc/150?u=rahul', role: 'Engineer' },
        dueDate: addDays(now, 2), createdAt: subDays(now, 1), tags: ['maintenance', 'urgent']
      },
      {
        title: 'Sensor battery replacement', description: 'Replace batteries for 5 strain sensors',
        structureId: structures[1]._id, structureName: 'Bandra-Worli Sea Link',
        priority: 'medium', status: 'in-progress',
        assignee: { name: 'Priya Patel', avatar: 'https://i.pravatar.cc/150?u=priya', role: 'Technician' },
        dueDate: addDays(now, 5), createdAt: subDays(now, 2), tags: ['sensors']
      },
      {
        title: 'Structural audit report', description: 'Compile Q3 structural audit report for Signature Bridge',
        structureId: structures[3]._id, structureName: 'Signature Bridge',
        priority: 'high', status: 'scheduled',
        assignee: { name: 'Vikram Singh', avatar: 'https://i.pravatar.cc/150?u=vikram', role: 'Inspector' },
        dueDate: addDays(now, 7), createdAt: subDays(now, 3), tags: ['audit', 'report']
      },
      {
        title: 'Corrosion treatment', description: 'Apply anti-corrosion coating on Pamban Bridge joints',
        structureId: structures[4]._id, structureName: 'Pamban Bridge',
        priority: 'medium', status: 'review',
        assignee: { name: 'Anita Gupta', avatar: 'https://i.pravatar.cc/150?u=anita', role: 'Engineer' },
        dueDate: addDays(now, 3), createdAt: subDays(now, 5), tags: ['maintenance', 'corrosion']
      },
      {
        title: 'Sensor calibration', description: 'Calibrate tilt sensors on Chenab Rail Bridge',
        structureId: structures[2]._id, structureName: 'Chenab Rail Bridge',
        priority: 'low', status: 'completed',
        assignee: { name: 'Ravi Kumar', avatar: 'https://i.pravatar.cc/150?u=ravi', role: 'Technician' },
        dueDate: subDays(now, 1), createdAt: subDays(now, 10), tags: ['sensors', 'calibration']
      }
    ];

    const tasks = await KanbanTask.insertMany(kanbanData);
    console.log(`📋 Created ${tasks.length} kanban tasks`);

    // ── Inspections ──
    const inspectionsData = [
      {
        structureId: structures[0]._id, structureName: 'Howrah Bridge',
        date: subDays(now, 15), inspector: 'Rahul Desai', type: 'manual',
        findings: 'Minor rust on secondary joints.', compliance: 'pass',
        images: [], severity: 'minor', duration: '4h', notes: 'Scheduled for next month.'
      },
      {
        structureId: structures[3]._id, structureName: 'Signature Bridge',
        date: subDays(now, 2), inspector: 'Vikram Singh', type: 'ai',
        findings: 'Significant stress fractures detected on Span 3.', compliance: 'fail',
        images: [], severity: 'severe', duration: '6h', notes: 'Immediate action required.'
      },
      {
        structureId: structures[1]._id, structureName: 'Bandra-Worli Sea Link',
        date: subDays(now, 30), inspector: 'Priya Patel', type: 'scheduled',
        findings: 'Cable tension within acceptable range. Minor concrete spalling observed.', compliance: 'review',
        images: [], severity: 'moderate', duration: '8h', notes: 'Follow-up in 2 weeks.'
      }
    ];

    const inspections = await Inspection.insertMany(inspectionsData);
    console.log(`🔍 Created ${inspections.length} inspections`);

    // ── Notifications ──
    const users = await User.find();
    const adminUserId = users[0]._id;
    
    const notificationsData = [
      { userId: adminUserId, title: 'Critical Alert', message: 'Vibration spike detected on Signature Bridge', type: 'alert', timestamp: subMinutes(now, 5), read: false },
      { userId: adminUserId, title: 'Task Completed', message: 'Sensor calibration finished', type: 'success', timestamp: subHours(now, 2), read: true },
      { userId: adminUserId, title: 'Inspection Due', message: 'Bandra-Worli Sea Link inspection due in 15 days', type: 'warning', timestamp: subHours(now, 6), read: false },
      { userId: adminUserId, title: 'System Update', message: 'AI model retrained with latest sensor data', type: 'info', timestamp: subDays(now, 1), read: true }
    ];

    const notifications = await Notification.insertMany(notificationsData);
    console.log(`🔔 Created ${notifications.length} notifications`);

    // ── Predictions ──
    const predictionsData = Array.from({ length: 90 }, (_, i) => ({
      date: addDays(now, i - 30), // some past predictions to show a curve
      predicted: 80 - Math.random() * 10,
      actual: i < 30 ? 80 - Math.random() * 8 : undefined,
      confidence: 90 + Math.random() * 8
    }));

    await Prediction.insertMany(predictionsData);
    console.log(`📈 Created ${predictionsData.length} predictions`);

    // ── Anomalies ──
    const anomaliesData = [
      {
        date: subDays(now, 1),
        sensorId: sensors[0]._id, sensorName: 'Stay Cable Tension Sensor 4',
        structureName: 'Signature Bridge',
        value: 125, expected: 150, severity: 'high'
      },
      {
        date: subDays(now, 3),
        sensorId: sensors[1]._id, sensorName: 'Pylon Corrosion Monitor',
        structureName: 'Bandra-Worli Sea Link',
        value: 0.85, expected: 0.3, severity: 'medium'
      },
      {
        date: subDays(now, 5),
        sensorId: sensors[2]._id, sensorName: 'Girder Strain Gauge',
        structureName: 'Pamban Bridge',
        value: 860, expected: 400, severity: 'high'
      },
      {
        date: subDays(now, 10),
        sensorId: sensors[3]._id, sensorName: 'Pier Tilt Sensor',
        structureName: 'Mahatma Gandhi Setu',
        value: 0.65, expected: 0.1, severity: 'medium'
      },
      {
        date: subDays(now, 15),
        sensorId: sensors[4]._id, sensorName: 'Anchor Arm Strain Sensor',
        structureName: 'Howrah Bridge',
        value: 620, expected: 350, severity: 'medium'
      }
    ];

    await Anomaly.insertMany(anomaliesData);
    console.log(`⚠️  Created ${anomaliesData.length} anomalies`);

    // ── Cost Forecasts ──
    const costForecastsData = Array.from({ length: 12 }, (_, i) => ({
      month: `2026-${(i + 1).toString().padStart(2, '0')}`,
      predicted: 50000 + Math.random() * 10000,
      actual: i < 9 ? 48000 + Math.random() * 12000 : undefined,
      category: 'Maintenance'
    }));

    await CostForecast.insertMany(costForecastsData);
    console.log(`💰 Created ${costForecastsData.length} cost forecasts`);

    // ── Model Metrics ──
    const modelMetricsData = [
      { name: 'Crack Detection CNN', accuracy: 94.5, precision: 92.1, recall: 95.0, f1Score: 93.5, lastTrained: subDays(now, 2), dataPoints: 150000 },
      { name: 'Corrosion Classifier', accuracy: 89.2, precision: 88.5, recall: 90.1, f1Score: 89.3, lastTrained: subDays(now, 5), dataPoints: 85000 },
      { name: 'Vibration Anomaly Detector', accuracy: 91.8, precision: 90.3, recall: 93.2, f1Score: 91.7, lastTrained: subDays(now, 1), dataPoints: 200000 },
      { name: 'Load Stress Predictor', accuracy: 87.6, precision: 86.2, recall: 88.9, f1Score: 87.5, lastTrained: subDays(now, 7), dataPoints: 120000 }
    ];

    await ModelMetrics.insertMany(modelMetricsData);
    console.log(`🤖 Created ${modelMetricsData.length} model metrics`);

    console.log('\n✅ Database seeded successfully!');
    console.log('   Login: demo@structureai.com / demo1234\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
