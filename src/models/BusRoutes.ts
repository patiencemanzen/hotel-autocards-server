import mongoose, { Document, Schema } from "mongoose";

interface IBusRoute extends Document {
  bus: string;
  from?: Object;
  to?: Object;
  deleted?: boolean;
  deletedAt?: Date;
}

const BusRouteSchema = new Schema<IBusRoute>({
    bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Buses', required: true } as unknown,
    from: { type: Object, required: false },
    to: { type: Object, required: false },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
}, { timestamps: true });

BusRouteSchema.pre<IBusRoute>('find', function() {
  this.populate('bus');
});

const BusRoute = mongoose.model<IBusRoute>("Bus_Routes", BusRouteSchema);

export { IBusRoute, BusRoute };
