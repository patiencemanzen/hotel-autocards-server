/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { validationResult } from "express-validator";
import { tryCatch } from "../helpers/general-helpers";
import { Database, IProject, IUserModel } from "../models";
import { Request, Response } from "express";
import { sendDbNotification } from "../services/NotificationService";

// Extend the Request interface
interface RequestWithModel extends Request {
    organization: {
      _id: string;
    };
    project: {
        _id: string;
    };
}

/**
 * Controller function for fetching all Databases
 * 
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const index = async (req: RequestWithModel, res: Response) => {
    return tryCatch(async () => {
        const project = req.project as IProject;
        const databases = await Database.find({ project: project._id, deleted: false });

        res.status(200).json({ status: "success", data: databases, message: "Databases fetched successfully" });
    }, (error) => res.status(400).json({ status: "error", error: error, message: error.message || "Unable to fetch Databases" }));
}

/**
 * Controller function for fetching a single Database
 * 
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const show = async (req: RequestWithModel, res: Response) => {
    return tryCatch(async () => {
        const project = req.project as IProject;
        const { id } = req.params;

        const database = await Database.findOne({ _id: id, project: project._id, deleted: false });

        if (!database) return res.status(404).json({ status: "error", message: "Database not found" });

        res.status(200).json({ status: "success", data: database, message: "Database fetched successfully" });
    }, (error) => res.status(400).json({ status: "error", error: error, message: error.message || "Unable to fetch Database" }));
}

/**
 * Controller function for Database creation
 * 
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const store = async (req: RequestWithModel, res: Response) => {
    return tryCatch(async () => {
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(422).json({ status: "error", errors: errors.array(), message: "Validation failed" });

        const { name, description } = req.body;
        const project = req.project as IProject;
        const user = req.user as IUserModel;

        const database = await Database.create({ name, description, project: project._id });

        sendDbNotification(user.email, user.telephone, `Database ${database.name} created successfully`, `Database ${database.name} has been added successfully in project ${project.name}`, user);

        res.status(201).json({ status: "success", data: database, message: "Database created successfully" });
    }, (error) => res.status(400).json({ status: "error", error: error, message: error.message || "Unable to create Database" }));
}

/**
 * Controller function for updating a Database
 * 
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const update = async (req: RequestWithModel, res: Response) => {
    return tryCatch(async () => {
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(422).json({ status: "error", errors: errors.array(), message: "Validation failed" });

        const { id } = req.params;
        const { name, description } = req.body;

        const project = req.project as IProject;
        const user = req.user as IUserModel;

        const database = await Database.findOne({ _id: id, project: project._id, deleted: false });

        if (!database) return res.status(404).json({ status: "error", message: "Database not found" });

        database.name = name;
        database.description = description;
        await database.save();

        sendDbNotification(user.email, user.telephone, `Database ${database.name} updated successfully`, `Database ${database.name} has been updated successfully in project ${project.name}`, user);

        res.status(200).json({ status: "success", data: database, message: "Database updated successfully" });
    }, (error) => res.status(400).json({ status: "error", error: error, message: error.message || "Unable to update Database" }));
}

/**
 * Controller function for deleting a Database
 * 
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const destroy = async (req: RequestWithModel, res: Response) => {
    return tryCatch(async () => {
        const { id } = req.params;
        const project = req.project as IProject;
        const user = req.user as IUserModel;

        const database = await Database.findOne({ _id: id, project: project._id, deleted: false });

        if (!database) return res.status(404).json({ status: "error", message: "Database not found" });

        database.deleted = true;
        database.deletedAt = new Date();
        await database.save();

        sendDbNotification(user.email, user.telephone, `Database ${database.name} deleted successfully`, `Database ${database.name} has been deleted successfully in project ${project.name}`, user);

        res.status(200).json({ status: "success", message: "Database deleted successfully" });
    }, (error) => res.status(400).json({ status: "error", error: error, message: error.message || "Unable to delete Database" }));
}

