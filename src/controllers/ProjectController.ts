/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { validationResult } from "express-validator";
import { tryCatch } from "../helpers/general-helpers";
import { IUserModel, Project } from "../models";
import { Request, Response } from "express";
import { sendDbNotification } from "../services/NotificationService";

// Extend the Request interface
interface RequestWithOrganization extends Request {
    organization: {
      _id: string;
    };
}

/**
 * Controller function for fetching all Projects
 * 
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const index = async (req: RequestWithOrganization, res: Response) => {
    return tryCatch(async () => {
      const organizationId = req.organization._id;
      const { query, order = { createdAt: 'desc' }, page = 1, limit = 10 } = req.query;

      const filters: any = { organization: organizationId, deleted: false };
      if (query) filters.name = new RegExp(query as string, 'i');

      const projects = await Project.find(filters).sort(order as { [key: string]: 'asc' | 'desc' }).limit(Number(limit) * 1).skip((Number(page) - 1) * Number(limit)).exec();
      const count = await Project.countDocuments(filters);

      res.status(200).json({ status: "success", data: projects, message: "Projects fetched successfully", total_pages: Math.ceil(count / Number(limit)), current_page: Number(page) });
    }, (error) => res.status(400).json({ status: "error", error: error, message: error.message || "Unable to fetch Projects" }));
}

/**
 * Controller function for fetching a single Project
 * 
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const show = async (req: RequestWithOrganization, res: Response) => {
    return tryCatch(async () => {
      const organizationId = req.organization._id;
      const { id } = req.params;

      const project = await Project.findOne({ _id: id, organization: organizationId, deleted: false });

      if (!project) return res.status(404).json({ status: "error", message: "Project not found" });

      res.status(200).json({ status: "success", data: project, message: "Project fetched successfully" });
    }, (error) => res.status(400).json({ status: "error", error: error, message: error.message || "Unable to fetch Project" }));
}

/**
 * Controller function for Project creation
 * 
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const store = async (req: RequestWithOrganization, res: Response) => {
    return tryCatch(async () => {
        const errors = validationResult(req);
        const { name, description } = req.body;

        const organizationId = req.organization._id;
        const user = req.user as IUserModel;

        if (!errors.isEmpty())
            return res.status(422).json({ status: "error", errors: errors.array(), message: "Validation failed" });

        const project = await Project.create({ name, description, organization: organizationId });
        sendDbNotification(user.email, user.telephone, "Project Created", `🎉 Dear ${user.fullname},\n\nYour project ${project.name} has been created successfully.`, user);

        res.status(201).json({ status: "success", data: project, message: "Project created successfully" });
    }, (error) => res.status(400).json({ status: "error", error: error, message: error.message || "Unable to create Project" }));
}

/**
 * Controller function for updating a Project
 * 
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const update = async (req: RequestWithOrganization, res: Response) => {
    return tryCatch(async () => {
        const errors = validationResult(req);

        const { id } = req.params;
        const { name, description } = req.body;
        const organizationId = req.organization._id;
        const user = req.user as IUserModel;

        if (!errors.isEmpty())
            return res.status(422).json({ status: "error", errors: errors.array(), message: "Validation failed" });

        const project = await Project.findOneAndUpdate({ _id: id, organization: organizationId }, { name, description }, { new: true });
        sendDbNotification(user.email, user.telephone, "Project updated", `🎉 Dear ${user.fullname},\n\nYour project ${project.name} has been updated successfully.`, user);

        if (!project) return res.status(404).json({ status: "error", message: "Project not found" });

        res.status(200).json({ status: "success", data: project, message: "Project updated successfully" });
    }, (error) => res.status(400).json({ status: "error", error: error, message: error.message || "Unable to update Project" }));
}

/**
 * Controller function for deleting a Project
 * 
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const destroy = async (req: RequestWithOrganization, res: Response) => {
    return tryCatch(async () => {
        const organizationId = req.organization._id;
        const { id } = req.params;

        const project = await Project.findOne({ _id: id, organization: organizationId });

        if (!project) return res.status(404).json({ status: "error", message: "Project not found" });

        project.deleted = true;
        project.deletedAt = new Date();

        await project.save();

        res.status(200).json({ status: "success", message: "Project deleted successfully" });
    }, (error) => res.status(400).json({ status: "error", error: error, message: error.message || "Unable to delete Project" }));
}