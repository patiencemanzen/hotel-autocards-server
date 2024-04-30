/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { NextFunction } from "express";
import { Request, Response } from "express";
import { IUserModel, Organization } from "../models";
import { tryCatch } from "../helpers/general-helpers";

// Extend the Request interface
interface RequestWithOrganization extends Request {
    organization: {
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
export const checkOrganizationOwnership = async (req: RequestWithOrganization, res: Response, next: NextFunction) => {
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
