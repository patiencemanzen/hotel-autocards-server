import mongoose, { Document, Schema } from "mongoose";

interface ICardModel extends Document {
  name: string;
  serial_number: string;
}

const cardSchema = new Schema<ICardModel>({
    name: { type: String, trim: true },
    serial_number: { type: String, required: true, unique: true, trim: true },
}, { timestamps: true });

const Card = mongoose.model<ICardModel>("Card", cardSchema);

export { Card, ICardModel };