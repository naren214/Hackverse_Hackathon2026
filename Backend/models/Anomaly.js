import mongoose from 'mongoose';

const anomalySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  sensorId: { type: String, required: true },
  sensorName: { type: String, required: true },
  structureName: { type: String, required: true },
  value: { type: Number, required: true },
  expected: { type: Number, required: true },
  severity: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' }
}, { timestamps: true });

anomalySchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  return obj;
};

export default mongoose.model('Anomaly', anomalySchema);
