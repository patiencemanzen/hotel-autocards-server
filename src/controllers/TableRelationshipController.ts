/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { validationResult } from "express-validator";
import { tryCatch } from "../helpers/general-helpers";
import { IUserModel, Table, TableColumn, TableRelationship } from "../models";
import { Request, Response } from "express";
import { sendDbNotification } from "../services/NotificationService";

/**
 * Controller function for Table Relationship creation
 * 
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const store = async (req: Request, res: Response) => {
    return tryCatch(async () => {
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(422).json({ status: "error", errors: errors.array(), message: "Validation failed" });

        const relationship = req.body;
        const user = req.user as IUserModel;

        // Get the names of the referenced table and primary key field
        const referencedTable = await Table.findOne({ _id: relationship.referenced_table });
        const primaryKeyField = await TableColumn.findOne({ _id: relationship.primary_key_field });

        // Format the naming_convention field
        relationship.naming_convention = `fk_${referencedTable.name}_${primaryKeyField.name}`;

        const tableRelationship = await TableRelationship.create(relationship);
        const childTable = await Table.findOne({ _id: tableRelationship.child_table });

        sendDbNotification(user.email, user.telephone, `Table relationship ${tableRelationship._id} created`, `Table relationship ${tableRelationship._id} added to ${childTable.name}`, user);

        res.status(201).json({ status: "success", message: "Table relationship created successfully" });
    }, (error) => res.status(400).json({ status: "error", error: error, message: error.message || "Unable to create table relationship" }));
}

/**
 * Controller function for Table Relationship update
 * 
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const update = async (req: Request, res: Response) => {
    return tryCatch(async () => {
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(422).json({ status: "error", errors: errors.array(), message: "Validation failed" });

        const { relation_id } = req.params;
        const relationship = req.body;
        const user = req.user as IUserModel;

        // Get the names of the referenced table and primary key field
        const referencedTable = await Table.findOne({ _id: relationship.referenced_table });
        const primaryKeyField = await TableColumn.findOne({ _id: relationship.primary_key_field });

        // Format the naming_convention field
        relationship.naming_convention = `fk_${referencedTable.name}_${primaryKeyField.name}`;

        const tableRelationship = await TableRelationship.findOneAndUpdate({ _id: relation_id }, relationship, { new: true });
        const childTable = await Table.findOne({ _id: tableRelationship.child_table });

        sendDbNotification(user.email, user.telephone, `Table relationship ${tableRelationship._id} updated`, `Table relationship ${tableRelationship._id} updated in ${childTable.name}`, user);

        res.status(200).json({ status: "success", message: "Table relationship updated successfully" });
    }, (error) => res.status(400).json({ status: "error", error: error, message: error.message || "Unable to update table relationship" }));
}

/**
 * Controller function for Table Relationship deletion
 * 
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const destroy = async (req: Request, res: Response) => {
    return tryCatch(async () => {
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(422).json({ status: "error", errors: errors.array(), message: "Validation failed" });

        const { relation_id } = req.params;
        const user = req.user as IUserModel;

        const tableRelationship = await TableRelationship.findOneAndDelete({ _id: relation_id });
        const childTable = await Table.findOne({ _id: tableRelationship.child_table });

        sendDbNotification(user.email, user.telephone, `Table relationship ${tableRelationship._id} deleted`, `Table relationship ${tableRelationship._id} deleted from ${childTable.name}`, user);

        res.status(200).json({ status: "success", message: "Table relationship deleted successfully" });
    }, (error) => res.status(400).json({ status: "error", error: error, message: error.message || "Unable to delete table relationship" }));
}