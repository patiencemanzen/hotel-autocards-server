import mongoose, { Document, Schema } from "mongoose";

interface IModelHistory extends Document {
    name: string;
    originalDoc: Object;
    version: string;
    data: Object;
    onModel: string;
    deleted?: boolean;
    deletedAt?: Date;
    createdAt: Date;
}

const ModelHistorySchema = new Schema<IModelHistory>({
    name: { type: String },
    originalDoc: { type: Object },
    version: { type: String },
    data: { type: Object },
    onModel: { type: String, required: true },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
}, { timestamps: true });

const ModelHistory = mongoose.model<IModelHistory>("model_histories", ModelHistorySchema);

export { IModelHistory, ModelHistory };
