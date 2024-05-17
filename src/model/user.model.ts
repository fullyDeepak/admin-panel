import mongoose from 'mongoose';
import { hash } from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      required: [true, 'Please provide a name.'],
      type: String,
    },
    email: {
      required: [true, 'Please provide an email address.'],
      unique: true,
      type: String,
    },
    password: {
      required: [true, 'Please provide a password'],
      type: String,
    },
    isVerified: {
      default: false,
      type: Boolean,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await hash(user.password, 8);
  }
  next();
});

// export const User = mongoose.model('User', userSchema);

export default mongoose.models.User || mongoose.model('User', userSchema);
