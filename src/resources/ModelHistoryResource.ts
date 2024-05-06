/**
 * Format the model history data
 * 
 * @param modelHistory 
 * @returns 
 */
export const collection = (modelHistories: any[]) => {
    return modelHistories.map(history => formatSingle(history));
}

/**
 * Format a single model history
 * 
 * @param history 
 * @returns 
 */
export const formatSingle = (history: any) => {
    return {
        id: history._id,
        version: history.version,
        onModel: history.onModel,
        data: history.data,
        createdAt: history.createdAt
    };
}