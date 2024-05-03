import { ModelHistory } from "../models";

export const versioningPlugin = (schema, _options) => {
    schema.add({ version: { type: Number, default: 0 } });
  
    schema.pre('save', function(next) {
        this.version++;
        next();
    });

    schema.pre(['update', 'findOneAndUpdate'], function(next) {
        this._update.$inc = { version: 1 };
        next();
    });
  
    schema.post(['save', 'update', 'findOneAndUpdate'], async (doc) => {
        const historyDoc = new ModelHistory({
            originalId: {
                id: doc._id,
                name: doc.constructor.modelName
            },
            version: doc.version,
            data: doc,
            onModel: doc.constructor.modelName
        });

        await historyDoc.save();
    });
};