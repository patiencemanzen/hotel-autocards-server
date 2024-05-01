import mongoose, { Document, Schema } from "mongoose";

interface ITableDatatype extends Document {
  name: string;
  description: string;
  deleted?: boolean;
  deletedAt?: Date;
}

const TableDatatypeSchema = new Schema<ITableDatatype>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  deleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
}, { timestamps: true });

const TableDatatype = mongoose.model<ITableDatatype>("table_data_types", TableDatatypeSchema);

export { ITableDatatype, TableDatatype };