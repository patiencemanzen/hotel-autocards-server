import mongoose, { Document, Schema } from "mongoose";

interface IOrganization extends Document {
  name?: string;
  user: string;
  description?: string;
  deleted?: boolean;
  deletedAt?: Date;
}

const OrganizationSchema = new Schema<IOrganization>({
  name: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } as unknown,
  description: { type: String },
  deleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
}, { timestamps: true });

const Organization = mongoose.model<IOrganization>("Organizations", OrganizationSchema);

export { IOrganization, Organization };
