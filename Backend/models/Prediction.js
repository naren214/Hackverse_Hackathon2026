import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  predicted: { type: Number, required: true },
  actual: { type: Number },
  confidence: { type: Number, required: true }
}, { timestamps: true });

predictionSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  return obj;
};

export default mongoose.model('Prediction', predictionSchema);
