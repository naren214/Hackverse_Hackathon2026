import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['admin', 'engineer', 'inspector', 'viewer'], default: 'viewer' },
  avatar: { type: String, default: '' },
  department: { type: String, default: '' },
  organization: { type: String, default: 'Public Works Department' },
  designation: { type: String, default: '' },
  jurisdiction: { type: String, default: '' },
  employeeId: { type: String, default: '' },
  verified: { type: Boolean, default: false },
  lastLogin: { type: Date, default: Date.now }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  obj.id = obj._id.toString();
  return obj;
};

export default mongoose.model('User', userSchema);
