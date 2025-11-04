import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  profileImage: { type: String },
  location: { type: String },
  phoneNumber: { type: String },
  biography: { type: String },
  isActive: { type: Boolean, default: false },
  plan: { type: String, default: 'free' },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

export default mongoose.model('User', userSchema);