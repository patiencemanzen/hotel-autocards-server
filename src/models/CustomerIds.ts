import mongoose, { Document, Schema } from "mongoose";

interface ICustomerIds extends Document {
  customer: string;
  card_id: string;
}

const customerId = new Schema<ICustomerIds>({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true } as unknown,
    card_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Card', required: true } as unknown,
  },
  { timestamps: true }
);

const CustomerId = mongoose.model<ICustomerIds>("Customer_ID", customerId);

export { CustomerId, ICustomerIds };
