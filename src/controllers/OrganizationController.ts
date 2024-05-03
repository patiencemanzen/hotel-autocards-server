/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { validationResult } from "express-validator";
import { tryCatch } from "../helpers/general-helpers";
import { IUserModel, Organization } from "../models";
import { Request, Response } from "express";
import { sendDbNotification } from "../services/NotificationService";

/**
 * Controller function for fetching all Organizations
 * 
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const index = async (req: Request, res: Response) => {
    return tryCatch(async () => {
      const user = req.user as IUserModel;

      const { query, order = { createdAt: 'desc' }, page = 1, limit = 10 } = req.query;
      const filters: any = { user: user._id, deleted: false };
      if (query) filters.name = new RegExp(query as string, 'i');

      const organizations = await Organization.find(filters).sort(order as { [key: string]: 'asc' | 'desc' }).limit(Number(limit) * 1).skip((Number(page) - 1) * Number(limit)).exec();
      const count = await Organization.countDocuments(filters);

      res.status(200).json({ status: "success", data: organizations, message: "Organizations fetched successfully", total_pages: Math.ceil(count / Number(limit)), current_page: Number(page) });
    }, (error) => res.status(400).json({ status: "error", error: error, message: error.message || "Unable to fetch organizations" }));
}

/**
 * Controller function for fetching a single Organization
 * 
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const show = async (req: Request, res: Response) => {
    return tryCatch(async () => {
      const user = req.user as IUserModel;
      const { id } = req.params;

      const organization = await Organization.findOne({ _id: id, user: user._id, deleted: false });

      if (!organization) return res.status(404).json({ status: "error", message: "Organization not found" });

      res.status(200).json({ status: "success", data: organization, message: "Organization fetched successfully" });
    }, (error) => res.status(400).json({ status: "error", error: error, message: error.message || "Unable to fetch organization" }));
}

/**
 * Controller function for Organization creation
 * 
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const store = async (req: Request, res: Response) => {
    return tryCatch(async () => {
      const errors = validationResult(req);
      const { name, description } = req.body;
      const user = req.user as IUserModel;

      if (!errors.isEmpty())
        return res.status(422).json({ status: "error", errors: errors.array(), message: "Validation failed" });

      const organization = await Organization.create({ name, user, description });

      sendDbNotification(user.email, user.telephone, "Organization Created", `🎉 Dear ${user.fullname},\n\nYour organization ${organization.name} has been created successfully.`, user);

      res.status(201).send({
        status: "success",
        message: "Organization created successfully",
        data: organization
      });
    }, (error) => res.status(400).json({ status: "error", error: error, message: error.message || "Unable to create new organization" }));
};

/**
 * Controller function for updating an Organization
 * 
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const update = async (req: Request, res: Response) => {
    return tryCatch(async () => {
      const errors = validationResult(req);

      const { name, description } = req.body;
      const user = req.user as IUserModel;
      const { id } = req.params;

      if (!errors.isEmpty())
        return res.status(422).json({ status: "error", errors: errors.array(), message: "Validation failed" });

      const organization = await Organization.findOne({ _id: id, user: user._id });

      if (!organization) return res.status(404).json({ status: "error", message: "Organization not found" });

      organization.name = name;
      organization.description = description;
      await organization.save();

      res.status(200).json({ status: "success", data: organization, message: "Organization updated successfully" });
    }, (error) => res.status(400).json({ status: "error", error: error, message: error.message || "Unable to update organization" }));
}

/**
 * Controller function for deleting an Organization
 * 
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const destroy = async (req: Request, res: Response) => {
    return tryCatch(async () => {
      const user = req.user as IUserModel;
      const { id } = req.params;

      const organization = await Organization.findOne({ _id: id, user: user._id });

      if (!organization) return res.status(404).json({ status: "error", message: "Organization not found" });

      organization.deleted = true;
      organization.deletedAt = new Date();
      await organization.save();

      res.status(200).json({ status: "success", message: "Organization deleted successfully" });
    }, (error) => res.status(400).json({ status: "error", error: error, message: error.message || "Unable to delete organization" }));
}