import mongoose, { Document, Schema } from "mongoose";

interface IBusRouting extends Document {
  bus: string;
  coordinates: Object;
  bus_from: Object;
  bus_to: Object;
  deleted?: boolean;
  deletedAt?: Date;
}

const BusRoutingSchema = new Schema<IBusRouting>({
    bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Buses', required: true } as unknown,
    coordinates: { type: Object },
    bus_from: { type: Object },
    bus_to: { type: Object },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
}, { timestamps: true });

BusRoutingSchema.pre<IBusRouting>('find', function() {
  this.populate('bus');
});

const BusRouting = mongoose.model<IBusRouting>("Bus_Routings", BusRoutingSchema);

export { IBusRouting, BusRouting };
