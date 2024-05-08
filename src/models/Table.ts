import mongoose, { Document, Schema } from "mongoose";
import { versioningPlugin } from "../modules/VersioningModule";

interface ITable extends Document {
  name?: string;
  description?: string;
  filename?: string;
  tech_stack?: string;
  database: string;
  deleted?: boolean;
  deletedAt?: Date;
}

const TableSchema = new Schema<ITable>({
    name: { type: String, unique: true, required: true },
    description: { type: String },
    filename: { type: String, required: false, default: ""},
    tech_stack: { type: String, required: false, default: "unknown"},
    database: { type: mongoose.Schema.Types.ObjectId, ref: 'Database', required: true } as unknown,
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
}, { timestamps: true });

TableSchema.plugin(versioningPlugin);

const Table = mongoose.model<ITable>("Tables", TableSchema);

export { ITable, Table };
