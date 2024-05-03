import mongoose, { Document, Schema } from "mongoose";
import { versioningPlugin } from "../modules/VersioningModule";

interface ITable extends Document {
  name?: string;
  description?: string;
  database: string;
  deleted?: boolean;
  deletedAt?: Date;
}

const TableSchema = new Schema<ITable>({
    name: { type: String },
    description: { type: String },
    database: { type: mongoose.Schema.Types.ObjectId, ref: 'Database', required: true } as unknown,
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
}, { timestamps: true });

TableSchema.plugin(versioningPlugin);

const Table = mongoose.model<ITable>("Tables", TableSchema);

export { ITable, Table };
