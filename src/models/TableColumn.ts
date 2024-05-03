import mongoose, { Document, Schema } from "mongoose";
import { versioningPlugin } from "../modules/VersioningModule";

interface ITableColumn extends Document {
  name: string;
  data_type: string;
  length?: number;
  precision?: number;
  scale?: number;
  constraints?: {
    primaryKey?: boolean;
    foreignKey?: boolean;
    unique?: boolean;
    notNull?: boolean;
    check?: string;
    defaultValue?: string;
    autoIncrement?: boolean;
  };
  collation?: string;
  indexes?: boolean;
  computed_column?: string;
  description?: string;
  table: string;
  deleted?: boolean;
  deletedAt?: Date;
}

const TableColumnSchema = new Schema<ITableColumn>({
  name: { type: String, required: true },
  data_type: { type: String, required: true },
  length: { type: Number },
  precision: { type: Number },
  scale: { type: Number },
  constraints: {
    primaryKey: { type: Boolean },
    foreignKey: { type: Boolean },
    unique: { type: Boolean },
    notNull: { type: Boolean },
    check: { type: String },
    defaultValue: { type: Schema.Types.Mixed },
    autoIncrement: { type: Boolean },
  },
  collation: { type: String },
  indexes: { type: Boolean },
  computed_column: { type: String },
  description: { type: String },
  table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true } as unknown,
  deleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
}, { timestamps: true });

TableColumnSchema.plugin(versioningPlugin);

const TableColumn = mongoose.model<ITableColumn>("table_columns", TableColumnSchema);

export { ITableColumn, TableColumn };