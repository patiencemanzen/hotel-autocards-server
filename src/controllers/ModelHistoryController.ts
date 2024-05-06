import { tryCatch } from "../helpers/general-helpers";
import { Request, Response } from "express";
import { ModelHistory } from "../models";
import * as ModelHistoryResource from "../resources/ModelHistoryResource";

/**
 * Fetch all histories of a model and 
 * Organize the histories by date and hour 
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const index = async (req: Request, res: Response) => {
    return tryCatch(async () => {
        const { model } = req.params;

        const histories = await ModelHistory.find({ onModel: { $regex: new RegExp(`^${model}$`, 'i') } });

        const organizedHistories = histories.reduce((result, history) => {
            const month = history.createdAt.toLocaleString('en-US', { year: 'numeric', month: 'long' });
            const date = history.createdAt.toLocaleString('en-US', { day: '2-digit' });
            const hour = history.createdAt.toLocaleString('en-US', { hour: '2-digit', hour12: true });
            const minute = history.createdAt.toLocaleString('en-US', { minute: '2-digit', hour: '2-digit' });

            if (!result[month]) result[month] = {};

            if (!result[month][date]) result[month][date] = {};

            if (!result[month][date][hour]) result[month][date][hour] = {};

            if (!result[month][date][hour][minute]) result[month][date][hour][minute] = [];

            result[month][date][hour][minute].push(ModelHistoryResource.formatSingle(history));

            return result;
        }, {});

        res.status(200).json({ status: "success", data: organizedHistories, message: "Histories fetched successfully" });
    }, (error) => res.status(400).json({ status: "error", error: error, message: error.message || "Unable to fetch histories" }));
}

/**
 * Fetch a single history of a models
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const show = async (req: Request, res: Response) => {
    return tryCatch(async () => {
        const { id } = req.params;

        const history = await ModelHistory.findOne({ _id: id });

        if (!history) throw new Error('Model history not found');

        res.status(200).json({ status: "success", data: ModelHistoryResource.formatSingle(history), message: "History fetched successfully" });
    }, (error) => res.status(400).json({ status: "error", error: error, message: error.message || "Unable to fetch histories" }));
}

/**
 * Delete a single history of a model
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const destroy = async (req: Request, res: Response) => {
    return tryCatch(async () => {
        const { id } = req.params;

        const history = await ModelHistory.findByIdAndDelete(id);

        if (!history) throw new Error('No history found with this id');

        res.status(200).json({ status: "success", message: "History deleted successfully" });
    }, (error) => res.status(400).json({ status: "error", error: error, message: error.message || "Unable to delete history" }));
}