import mongoose, { Document, Schema } from "mongoose";

interface IUserPreferences extends Document {
  user_id: number;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
  created_at: Date;
  updated_at: Date;
}

const userPreferencesSchema = new Schema<IUserPreferences>({
  user_id: { type: Schema.Types.Number, required: true, unique: true },
  address: {
    street: { type: Schema.Types.String },
    city: { type: Schema.Types.String },
    state: { type: Schema.Types.String },
    postalCode: { type: Schema.Types.String },
  },
  created_at: { type: Schema.Types.Date, default: Date.now },
  updated_at: { type: Schema.Types.Date, default: Date.now },
});

const UserPreferences = mongoose.model<IUserPreferences>(
  "User_preferences",
  userPreferencesSchema
);

export { IUserPreferences, UserPreferences };
