/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { validationResult } from "express-validator";
import { tryCatch } from "../helpers/general-helpers";
import { TableDatatype } from "../models";
import { Request, Response } from "express";

/**
 * Controller function for fetching all Table Datatypes
 * 
 * @param _req - Express Request object
 * @param res - Express Response object
 */
export const index = async (_req: Request, res: Response) => {
    return tryCatch(async () => {
        const dataTypes = await TableDatatype.find({ deleted: false });

        res.status(200).json({ status: "success", data: dataTypes, message: "Table data-types fetched successfully" });
    }, (error) => res.status(400).json({ status: "error", error: error, message: error.message || "Unable to fetch table data-types" }));
}

/**
 * Controller function for Table Datatype creation
 * 
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const store = async (req: Request, res: Response) => {
    return tryCatch(async () => {
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(422).json({ status: "error", errors: errors.array(), message: "Validation failed" });

        const { name, description } = req.body;
        const dataType = await TableDatatype.create({ name, description });

        res.status(201).json({ status: "success", data: dataType, message: "Table data-type created successfully" });
    }, (error) => res.status(400).json({ status: "error", error: error, message: error.message || "Unable to create table data-type" }));
}

/**
 * Controller function for updating a Table Datatype
 * 
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const update = async (req: Request, res: Response) => {
    return tryCatch(async () => {
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(422).json({ status: "error", errors: errors.array(), message: "Validation failed" });

        const { id } = req.params;
        const { name, description } = req.body;

        const dataType = await TableDatatype.findOneAndUpdate({ _id: id, deleted: false }, { name, description }, { new: true });
        if (!dataType) return res.status(404).json({ status: "error", message: "Table data-type not found" });

        res.status(200).json({ status: "success", data: dataType, message: "Table data-type updated successfully" });
    }, (error) => res.status(400).json({ status: "error", error: error, message: error.message || "Unable to update table data-type" }));
}

/**
 * Controller function for deleting a Table Datatype
 * 
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const destroy = async (req: Request, res: Response) => {
    return tryCatch(async () => {
        const { id } = req.params;

        const dataType = await TableDatatype.findOneAndUpdate({ _id: id, deleted: false }, { deleted: true, deletedAt: new Date() }, { new: true });
        if (!dataType) return res.status(404).json({ status: "error", message: "Table data-type not found" });

        res.status(200).json({ status: "success", data: dataType, message: "Table data-type deleted successfully" });
    }, (error) => res.status(400).json({ status: "error", error: error, message: error.message || "Unable to delete table data-type" }));
}