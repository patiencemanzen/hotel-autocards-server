import mongoose, { Document, Schema } from "mongoose";

interface IUserModel extends Document {
  fullname: string;
  email: string;
  avatar?: string;
  password: string;
  rememberToken: string;
  verified: boolean;
  verifyOtp: string;
  otpExpiresAt: Date;
}

const userSchema = new Schema<IUserModel>({
  fullname: { type: String, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  avatar: { typr: String },
  password: { type: String, required: true },
  rememberToken: String,
  verified: { type: Boolean, default: false },
  verifyOtp: String,
  otpExpiresAt: { type: Date, default: () => new Date(Date.now() + 5 * 60 * 1000) },
}, { timestamps: true });

const User = mongoose.model<IUserModel>("User", userSchema);

export { User, IUserModel };