import mongoose, { Document, Schema } from "mongoose";

interface IProject extends Document {
  name?: string;
  organization: string;
  description?: string;
  deleted?: boolean;
  deletedAt?: Date;
}

const ProjectSchema = new Schema<IProject>({
    name: { type: String },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true } as unknown,
    description: { type: String },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
}, { timestamps: true });

const Project = mongoose.model<IProject>("Projects", ProjectSchema);

export { IProject, Project };
