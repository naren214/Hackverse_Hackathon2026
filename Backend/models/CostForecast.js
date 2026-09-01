import mongoose from 'mongoose';

const costForecastSchema = new mongoose.Schema({
  month: { type: String, required: true },
  predicted: { type: Number, required: true },
  actual: { type: Number },
  category: { type: String, default: 'Maintenance' }
}, { timestamps: true });

costForecastSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  return obj;
};

export default mongoose.model('CostForecast', costForecastSchema);
