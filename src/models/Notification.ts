import mongoose, { Document, Schema } from "mongoose";

interface INotification extends Document {
  email?: string;
  phoneNumber?: string;
  subject: string;
  message: string;
  created_at: Date;
  updated_at: Date;
}

const notificationSchema = new Schema<INotification>({
  email: { type: String },
  phoneNumber: { type: String, required: false },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Notification = mongoose.model<INotification>(
  "Notifications",
  notificationSchema
);

export { INotification, Notification };
