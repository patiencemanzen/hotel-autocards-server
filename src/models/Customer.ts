import mongoose, { Document, Schema } from "mongoose";

interface ICustomerModel extends Document {
  fullname: string;
  email: string;
  national: string;
  passport: string;
  payment_method: string;
}

const customerSchema = new Schema<ICustomerModel>({
  fullname: { type: String, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  national: { typr: String },
  passport: { type: String },
  payment_method: { type: String }
}, { timestamps: true });

const Customer = mongoose.model<ICustomerModel>("Customer", customerSchema);

export { Customer, ICustomerModel };