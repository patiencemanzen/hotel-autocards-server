/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { validationResult } from "express-validator";
import { tryCatch } from "../helpers/general-helpers";
import { ITableColumn, IUserModel, TableColumn } from "../models";
import { Request, Response } from "express";
import { sendDbNotification } from "../services/NotificationService";

// Extend the Request interface
interface RequestWithModel extends Request {
    table: {
      _id: string;
      name: string;
    };
}

/**
 * Controller function for fetching all Table Columns
 * 
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const index = async (req: RequestWithModel, res: Response) => {
    return tryCatch(async () => {
        const { table_id } = req.params;
        const columns = await TableColumn.find({ table: table_id, deleted: false });

        res.status(200).json({ status: "success", data: columns, message: "Table columns fetched successfully" });
    }, (error) => res.status(400).json({ status: "error", error: error, message: error.message || "Unable to fetch table columns" }));
}

/**
 * Controller function for fetching a single Table Column
 * 
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const show = async (req: RequestWithModel, res: Response) => {
    return tryCatch(async () => {
        const { id, table_id } = req.params;

        const column = await TableColumn.findOne({ _id: id, table: table_id, deleted: false });
        if (!column) return res.status(404).json({ status: "error", message: "Table column not found" });

        res.status(200).json({ status: "success", data: column, message: "Table column fetched successfully" });
    }, (error) => res.status(400).json({ status: "error", error: error, message: error.message || "Unable to fetch table column" }));
}

/**
 * Controller function for Table Column creation
 * 
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const store = async (req: RequestWithModel, res: Response) => {
    return tryCatch(async () => {
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(422).json({ status: "error", errors: errors.array(), message: "Validation failed" });

        const columns: ITableColumn[] = req.body;
        const tableId = req.params.table_id;
        const user = req.user as IUserModel;

        const createColumnPromises = columns.map(column => {
            const newColumn = new TableColumn({ ...column, table: tableId });
            return newColumn.save();
        });

        const createdColumns = await Promise.all(createColumnPromises);

        sendDbNotification(user.email, user.telephone, "Table Column Created", `Table columns in table with ID ${tableId} added successfully`, user);

        res.status(201).json({ status: "success", data: createdColumns, message: "Table columns created successfully" });
    }, (error) => res.status(400).json({ status: "error", error: error, message: error.message || "Unable to create table columns" }));
}

/**
 * Controller function for updating a Table Column
 * 
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const update = async (req: RequestWithModel, res: Response) => {
    return tryCatch(async () => {
        const errors = validationResult(req);
    
        if (!errors.isEmpty())
            return res.status(422).json({ status: "error", errors: errors.array(), message: "Validation failed" });
    
        const { table_id } = req.params;
        const columns: ITableColumn[] = req.body;
        const user = req.user as IUserModel;
  
        const updateColumnPromises = columns.map(async column => {
            const updatedColumn = await TableColumn.findOneAndUpdate({ _id: column.id, table: table_id }, column, { new: true });
            if (!updatedColumn) throw new Error(`Table column with ID ${column.id} and NAME '${column.name}' not found`);
            return updatedColumn;
        });
    
        const updatedColumns = await Promise.all(updateColumnPromises);

        sendDbNotification(user.email, user.telephone, "Table Column Updated", `Table columns in table with ID ${table_id} updated successfully`, user);
    
        res.status(200).json({ status: "success", data: updatedColumns, message: "Table columns updated successfully" });
    }, (error) => res.status(400).json({ status: "error", error: error, message: error.message || "Unable to update table columns" }));
};

/**
 * Controller function for deleting a Table Column
 * 
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const destroy = async (req: RequestWithModel, res: Response) => {
    return tryCatch(async () => {
        const { table_id } = req.params;
        const columnIds = req.body;
  
        const deleteColumnPromises = columnIds.map(async (column: { id: string; }) => {
            const updatedColumn = await TableColumn.findOneAndUpdate({ _id: column.id, table: table_id }, { deleted: true, deletedAt: new Date() }, { new: true });
            if (!updatedColumn) throw new Error(`Table column with ID ${column.id} not found`);
            return updatedColumn;
        });
  
        await Promise.all(deleteColumnPromises);
  
        res.status(200).json({ status: "success", message: "Table columns deleted successfully" });
    }, (error) => res.status(400).json({ status: "error", error: error, message: error.message || "Unable to delete table columns" }));
};