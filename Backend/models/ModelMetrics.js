import mongoose from 'mongoose';

const modelMetricsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  accuracy: { type: Number, required: true },
  precision: { type: Number, required: true },
  recall: { type: Number, required: true },
  f1Score: { type: Number, required: true },
  lastTrained: { type: Date, required: true },
  dataPoints: { type: Number, required: true }
}, { timestamps: true });

modelMetricsSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  return obj;
};

export default mongoose.model('ModelMetrics', modelMetricsSchema);
