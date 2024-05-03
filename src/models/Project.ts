import mongoose, { Document, Schema } from "mongoose";
import { versioningPlugin } from "../modules/VersioningModule";

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

ProjectSchema.plugin(versioningPlugin);

const Project = mongoose.model<IProject>("Projects", ProjectSchema);

export { IProject, Project };
