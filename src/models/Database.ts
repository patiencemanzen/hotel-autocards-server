import mongoose, { Document, Schema } from "mongoose";

interface IDatabase extends Document {
  name?: string;
  project: string;
  description?: string;
  deleted?: boolean;
  deletedAt?: Date;
}

const DatabaseSchema = new Schema<IDatabase>({
    name: { type: String },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true } as unknown,
    description: { type: String },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
}, { timestamps: true });

const Database = mongoose.model<IDatabase>("Databases", DatabaseSchema);

export { IDatabase, Database };
