import mongoose, { Document, Schema } from "mongoose";

interface INotification extends Document {
  email?: string;
  phoneNumber?: string;
  subject: string;
  message: string;
}

const notificationSchema = new Schema<INotification>(
  {
    email: { type: String },
    phoneNumber: { type: String, required: false },
    subject: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const Notification = mongoose.model<INotification>(
  "Notifications",
  notificationSchema
);

export { INotification, Notification };
