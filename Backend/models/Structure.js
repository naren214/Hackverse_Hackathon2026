import mongoose from 'mongoose';

const structureSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ['bridge', 'flyover', 'building'], required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' }
  },
  healthScore: { type: Number, default: 100, min: 0, max: 100 },
  status: { type: String, enum: ['healthy', 'warning', 'critical', 'offline'], default: 'healthy' },
  sensorCount: { type: Number, default: 0 },
  activeSensors: { type: Number, default: 0 },
  lastInspection: { type: Date },
  nextInspection: { type: Date },
  imageUrl: { type: String, default: '' },
  buildYear: { type: Number },
  material: { type: String, default: '' },
  length: { type: Number },
  spans: { type: Number },
  description: { type: String, default: '' }
}, { timestamps: true });

structureSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  return obj;
};

export default mongoose.model('Structure', structureSchema);
