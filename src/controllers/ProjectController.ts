/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { validationResult } from "express-validator";
import { tryCatch } from "../helpers/general-helpers";
import { Project } from "../models";
import { Request, Response } from "express";

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
      const projects = await Project.find({ organization: organizationId, deleted: false });

      res.status(200).json({ status: "success", data: projects, message: "Projects fetched successfully" });
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

        if (!errors.isEmpty())
            return res.status(422).json({ status: "error", errors: errors.array(), message: "Validation failed" });

        const project = await Project.create({ name, description, organization: organizationId });

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
        const { name, description } = req.body;
        const organizationId = req.organization._id;
        const { id } = req.params;

        if (!errors.isEmpty())
            return res.status(422).json({ status: "error", errors: errors.array(), message: "Validation failed" });

        const project = await Project.findOneAndUpdate({ _id: id, organization: organizationId }, { name, description }, { new: true });

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