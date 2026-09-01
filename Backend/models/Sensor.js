import mongoose from 'mongoose';

const sensorReadingSchema = new mongoose.Schema({
  time: { type: String, required: true },
  value: { type: Number, required: true }
}, { _id: false });

const sensorSchema = new mongoose.Schema({
  structureId: { type: mongoose.Schema.Types.ObjectId, ref: 'Structure', required: true },
  structureName: { type: String, required: true },
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['vibration', 'strain', 'temperature', 'displacement', 'tilt', 'humidity', 'corrosion'],
    required: true
  },
  status: { type: String, enum: ['online', 'offline', 'warning'], default: 'online' },
  value: { type: Number, default: 0 },
  unit: { type: String, default: '' },
  battery: { type: Number, default: 100, min: 0, max: 100 },
  lastReading: { type: Date, default: Date.now },
  history: [sensorReadingSchema],
  threshold: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 100 }
  },
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    z: { type: Number, default: 0 }
  },
  installDate: { type: Date }
}, { timestamps: true });

sensorSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  return obj;
};

export default mongoose.model('Sensor', sensorSchema);
