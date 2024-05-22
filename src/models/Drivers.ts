import mongoose, { Document, Schema } from "mongoose";

interface IDrivers extends Document {
  name?: string;
  description?: string;
  lisence?: string;
  username?: string;
  pin_number?: string;
  deleted?: boolean;
  deletedAt?: Date;
}

const DriversSchema = new Schema<IDrivers>({
    name: { type: String },
    description: { type: String },
    lisence: { type: String },
    username: { type: String },
    pin_number: { type: String },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
}, { timestamps: true });

const Drivers = mongoose.model<IDrivers>("Drivers", DriversSchema);

export { IDrivers, Drivers };
