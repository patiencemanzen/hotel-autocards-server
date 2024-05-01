/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { NextFunction } from "express";
import { Request, Response } from "express";
import { Database, IUserModel, Organization, Project } from "../models";
import { tryCatch } from "../helpers/general-helpers";

// Extend the Request interface
interface RequestWithModel extends Request {
    organization: {
      _id: string;
    };

    project: {
        _id: string;
    };

    database: {
        _id: string;
    };
}

/**
 * Middleware function to check if the user owns the organization
 * 
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Express Next function
 */
export const bindOrganizationModels = async (req: RequestWithModel, res: Response, next: NextFunction) => {
    return tryCatch(async () => {
        const organizationId = req.params.organization;
        const user = req.user as IUserModel;

        const organization = await Organization.findOne({ _id: organizationId, user: user._id, deleted: false });

        if (!organization) 
            return res.status(404).json({ status: "error", message: "Organization not found or you do not have permission" });
        
        req.organization = organization;

        next();
    }, (error) => res.status(500).json({ status: "error", error: error, message: error.message }));
};

/**
 * Middleware function to check if the user owns the project and its organization
 * 
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Express Next function
 */
export const bindProjectModels = async (req: RequestWithModel, res: Response, next: NextFunction) => {
    return tryCatch(async () => {
        const projectId = req.params.project;
        const user = req.user as IUserModel;

        const project = await Project.findOne({ _id: projectId, deleted: false });

        if (!project) 
            return res.status(404).json({ status: "error", message: "Project not found" });

        const organization = await Organization.findOne({ _id: project.organization, user: user._id });

        if (!organization) 
            return res.status(404).json({ status: "error", message: "Project's organization not found or you do not have permission" });

        req.project = project;
        req.organization = organization;

        next();
    }, (error) => res.status(500).json({ status: "error", error: error, message: error.message }));
};

/**
 * Middleware function to check if the user owns the database, project and its organization
 * 
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Express Next function
 */
export const bindDatabaseModels = async (req: RequestWithModel, res: Response, next: NextFunction) => {
    return tryCatch(async () => {
        const databaseId = req.params.database;
        const user = req.user as IUserModel;

        const database = await Database.findOne({ _id: databaseId, deleted: false });
        if (!database) return res.status(404).json({ status: "error", message: "Database not found" });

        const project = await Project.findOne({ _id: database.project, deleted: false });
        if (!project) return res.status(404).json({ status: "error", message: "You do not have permission to this database" });

        const organization = await Organization.findOne({ _id: project.organization, user: user._id });
        if (!organization) return res.status(404).json({ status: "error", message: "Project's organization not found or you do not have permission" });

        req.organization = organization;
        req.project = project;
        req.database = database;

        next();
    }, (error) => res.status(500).json({ status: "error", error: error, message: error.message }));
}; 
