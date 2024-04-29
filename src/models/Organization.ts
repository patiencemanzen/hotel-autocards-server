import mongoose, { Document, Schema } from "mongoose";

interface IOrganization extends Document {
  name?: string;
  user: string;
}

const OrganizationSchema = new Schema<IOrganization>({
    name: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } as unknown
}, { timestamps: true });

const Organization = mongoose.model<IOrganization>("Organizations", OrganizationSchema);

export { IOrganization, Organization };
