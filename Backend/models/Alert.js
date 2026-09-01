import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  structureId: { type: mongoose.Schema.Types.ObjectId, ref: 'Structure', required: true },
  structureName: { type: String, required: true },
  sensorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sensor', required: true },
  sensorName: { type: String, required: true },
  severity: { type: String, enum: ['critical', 'warning', 'info'], required: true },
  status: { type: String, enum: ['new', 'acknowledged', 'resolved'], default: 'new' },
  message: { type: String, required: true },
  details: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now },
  recommendation: { type: String, default: '' }
}, { timestamps: true });

alertSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  return obj;
};

export default mongoose.model('Alert', alertSchema);
