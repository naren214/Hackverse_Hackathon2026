import mongoose from 'mongoose';

const inspectionSchema = new mongoose.Schema({
  structureId: { type: mongoose.Schema.Types.ObjectId, ref: 'Structure', required: true },
  structureName: { type: String, required: true },
  date: { type: Date, default: Date.now },
  inspector: { type: String, required: true },
  type: { type: String, enum: ['manual', 'ai', 'scheduled'], default: 'manual' },
  findings: { type: String, default: '' },
  compliance: { type: String, enum: ['pass', 'fail', 'review'], default: 'review' },
  images: [{ type: String }],
  severity: { type: String, enum: ['none', 'minor', 'moderate', 'severe'], default: 'none' },
  duration: { type: String, default: '' },
  notes: { type: String, default: '' }
}, { timestamps: true });

inspectionSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  return obj;
};

export default mongoose.model('Inspection', inspectionSchema);
