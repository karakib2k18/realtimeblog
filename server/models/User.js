import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // only for local accounts
  image: { type: String }     // ✅ Google profile picture
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;
