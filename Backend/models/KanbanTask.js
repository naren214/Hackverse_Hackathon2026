import mongoose from 'mongoose';

const kanbanTaskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  structureId: { type: mongoose.Schema.Types.ObjectId, ref: 'Structure' },
  structureName: { type: String, default: '' },
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  status: {
    type: String,
    enum: ['backlog', 'scheduled', 'in-progress', 'review', 'completed'],
    default: 'backlog'
  },
  assignee: {
    name: { type: String, default: '' },
    avatar: { type: String, default: '' },
    role: { type: String, default: '' }
  },
  dueDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  tags: [{ type: String }]
}, { timestamps: true });

kanbanTaskSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  return obj;
};

export default mongoose.model('KanbanTask', kanbanTaskSchema);
