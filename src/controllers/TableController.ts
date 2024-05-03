/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { validationResult } from "express-validator";
import { tryCatch } from "../helpers/general-helpers";
import { IUserModel, Table } from "../models";
import { Request, Response } from "express";
import { sendDbNotification } from "../services/NotificationService";

// Extend the Request interface
interface RequestWithModel extends Request {
    database: {
      _id: string;
      name: string;
    };
}

/**
 * Controller function for fetching all Tables
 * 
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const index = async (req: RequestWithModel, res: Response) => {
    return tryCatch(async () => {
        const { query, order = { createdAt: 'desc' }, page = 1, limit = 10 } = req.query;

        const filters: any = { database: req.database._id, deleted: false };
        if (query) filters.name = new RegExp(query as string, 'i');

        const table = await Table.find(filters).sort(order as { [key: string]: 'asc' | 'desc' }).limit(Number(limit) * 1).skip((Number(page) - 1) * Number(limit)).exec();
        const count = await Table.countDocuments(filters);

        res.status(200).json({ status: "success", data: table, message: "Tables fetched successfully", total_pages: Math.ceil(count / Number(limit)), current_page: Number(page) });
    }, (error) => res.status(400).json({ status: "error", error: error, message: error.message || "Unable to fetch tables" }));
}

/**
 * Controller function for fetching a single Table
 * 
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const show = async (req: RequestWithModel, res: Response) => {
    return tryCatch(async () => {
        const { id } = req.params;

        const table = await Table.findOne({ _id: id, database: req.database._id, deleted: false });

        if (!table) return res.status(404).json({ status: "error", message: "Table not found" });

        res.status(200).json({ status: "success", data: table, message: "Table fetched successfully" });
    }, (error) => res.status(400).json({ status: "error", error: error, message: error.message || "Unable to fetch table" }));
}

/**
 * Controller function for Table creation
 * 
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const store = async (req: RequestWithModel, res: Response) => {
    return tryCatch(async () => {
        const errors = validationResult(req);
        const user = req.user as IUserModel;

        if (!errors.isEmpty()) return res.status(400).json({ status: "error", errors: errors.array() });

        const table = await Table.create({ ...req.body, database: req.database._id });

        sendDbNotification(user.email, user.telephone, `Table ${table.name} created`, `Table ${table.name} added successfully in database ${req.database.name}`, user);
 
        res.status(201).json({ status: "success", data: table, message: "Table created successfully" });
    }, (error) => res.status(400).json({ status: "error", error: error, message: error.message || "Unable to create table" }));
}

/**
 * Controller function for Table update
 * 
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const update = async (req: RequestWithModel, res: Response) => {
    return tryCatch(async () => {
        const { id } = req.params;
        const user = req.user as IUserModel;

        const table = await Table.findOneAndUpdate({ _id: id, database: req.database._id, deleted: false }, req.body, { new: true });

        if (!table) return res.status(404).json({ status: "error", message: "Table not found" });

        sendDbNotification(user.email, user.telephone, `Table ${table.name} updated`, `Table ${table.name} updated successfully in database ${req.database.name}`, user);

        res.status(200).json({ status: "success", data: table, message: "Table updated successfully" });
    }, (error) => res.status(400).json({ status: "error", error: error, message: error.message || "Unable to update table" }));
}

/**
 * Controller function for Table deletion
 * 
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const destroy = async (req: RequestWithModel, res: Response) => {
    return tryCatch(async () => {
        const { id } = req.params;
        const user = req.user as IUserModel;

        const table = await Table.findOneAndUpdate({ _id: id, database: req.database._id, deleted: false }, { deleted: true, deletedAt: new Date() }, { new: true });

        if (!table) return res.status(404).json({ status: "error", message: "Table not found" });

        sendDbNotification(user.email, user.telephone, `Table ${table.name} deleted`, `Table ${table.name} deleted successfully from database ${req.database.name}`, user);

        res.status(200).json({ status: "success", message: "Table deleted successfully" });
    }, (error) => res.status(400).json({ status: "error", error: error, message: error.message || "Unable to delete table" }));
}