import mongoose, { Document, Schema } from "mongoose";

interface IUserPreferences extends Document {
  user_id: number;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
}

const userPreferencesSchema = new Schema<IUserPreferences>({
  user_id: { type: Schema.Types.Number, required: true, unique: true },
  address: {
    street: { type: Schema.Types.String },
    city: { type: Schema.Types.String },
    state: { type: Schema.Types.String },
    postalCode: { type: Schema.Types.String },
  },
}, { timestamps: true });

const UserPreferences = mongoose.model<IUserPreferences>(
  "User_preferences",
  userPreferencesSchema
);

export { IUserPreferences, UserPreferences };
