import mongoose, { Document, Schema } from "mongoose";

interface IPassenger extends Document {
  user?: string;
  deleted?: boolean;
  deletedAt?: Date;
}

const PassengerSchema = new Schema<IPassenger>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } as unknown,
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
}, { timestamps: true });


const Passenger = mongoose.model<IPassenger>("Passengers", PassengerSchema);

export { IPassenger, Passenger };
