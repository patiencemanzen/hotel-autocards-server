import mongoose, { Document, Schema } from "mongoose";

interface INotification extends Document {
  email?: string;
  subject: string;
  message: string;
  user: string;
}

const notificationSchema = new Schema<INotification>(
  {
    email: { type: String },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } as unknown
  },
  { timestamps: true }
);

const Notification = mongoose.model<INotification>(
  "Notifications",
  notificationSchema
);

export { INotification, Notification };
