import mongoose, { Document, Schema } from "mongoose";

interface IBuses extends Document {
  name?: string;
  driver?: string;
  description?: string;
  plate_number?: string;
  type?: string;
  capacity?: number;
  deleted?: boolean;
  deletedAt?: Date;
}

const BusesSchema = new Schema<IBuses>({
    name: { type: String },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Drivers', required: true } as unknown,
    description: { type: String },
    plate_number: { type: String },
    type: { type: String },
    capacity: { type: Number },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
}, { timestamps: true });

BusesSchema.pre<IBuses>('find', function() {
  this.populate('driver');
});

const Buses = mongoose.model<IBuses>("Buses", BusesSchema);

export { IBuses, Buses };
