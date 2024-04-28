/* eslint-disable @typescript-eslint/explicit-function-return-type */
import mongoose, { Document, Schema } from "mongoose";

interface IUserModel extends Document {
  firstname: string;
  lastname: string;
  email: string;
  avatar: string;
  password: string;
  phone_number: string;
  remember_token: string;
  verified: boolean;
  verify_otp: string;

  created_at: Date;
  updated_at: Date;
  otp_expires_at: Date;
}

const userSchema = new Schema<IUserModel>({
  firstname: String,
  lastname: String,
  email: { type: String, required: true, unique: true },
  avatar: String,
  password: { type: String, required: true },
  phone_number: { type: String, required: false, unique: true },
  remember_token: String,
  verified: { type: Boolean, default: false },
  verify_otp: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  otp_expires_at: {
    type: Date,
    default: () => new Date(Date.now() + 5 * 60 * 1000),
  },
});

const User = mongoose.model<IUserModel>("User", userSchema);

export { User, IUserModel };
