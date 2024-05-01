import mongoose, { Document, Schema } from "mongoose";

interface ITableRelationship extends Document {
    referenced_table: string;
    primary_key_field: string;
    child_table: string;
    foreign_key_field: string;
    data_type: string;
    naming_convention: string;
    constraints?: {
        notNull?: boolean;
        cascadeDelete?: boolean;
    };
    indexes?: boolean;
    relationship_type: string;
    cardinality: string;
}

const TableRelationshipSchema = new Schema<ITableRelationship>({
    referenced_table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true } as unknown,
    primary_key_field: { type: mongoose.Schema.Types.ObjectId, ref: 'TableColumn', required: true } as unknown,
    child_table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true } as unknown,
    foreign_key_field: { type: mongoose.Schema.Types.ObjectId, ref: 'TableColumn', required: true } as unknown,
    data_type: { type: String, required: true },
    naming_convention: { type: String, required: true },
    constraints: {
        notNull: { type: Boolean },
        cascadeDelete: { type: Boolean },
    },
    indexes: { type: Boolean },
    relationship_type: { type: String, required: true },
    cardinality: { type: String, required: true },
}, { timestamps: true });

const TableRelationship = mongoose.model<ITableRelationship>("table_relationships", TableRelationshipSchema);

export { ITableRelationship, TableRelationship };