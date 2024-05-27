import mongoose, { Document, Schema } from "mongoose";

interface IBusRoutingPassengers extends Document {
  busRouting?: string;
  passenger?: string;
  deleted?: boolean;
  deletedAt?: Date;
}

const BusRoutingPassengersSchema = new Schema<IBusRoutingPassengers>({
    busRouting: { type: mongoose.Schema.Types.ObjectId, ref: 'BusRoutings', required: true } as unknown,
    passenger: { type: mongoose.Schema.Types.ObjectId, ref: 'Passengers', required: true } as unknown,
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
}, { timestamps: true });

BusRoutingPassengersSchema.pre<IBusRoutingPassengers>('find', function() {
  this.populate('passenger');
});

const BusRoutingPassengers = mongoose.model<IBusRoutingPassengers>("Bus_Routing_Passengers", BusRoutingPassengersSchema);

export { IBusRoutingPassengers, BusRoutingPassengers };
