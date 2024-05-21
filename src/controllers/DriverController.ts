/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { validationResult } from "express-validator";
import { tryCatch } from "../helpers/general-helpers";
import { Drivers } from "../models";
import { Request, Response } from "express";

/**
 * Controller function for Drivers creation
 * 
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const store = async (req: Request, res: Response) => {
    return tryCatch(async () => {
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(422).json({ status: "error", errors: errors.array(), message: "Validation failed" });

        const { name, description, lisence } = req.body;

        const driver = await Drivers.create({ name, description, lisence });

        res.status(201).json({ status: "success", data: driver, message: "Driver created successfully" });
    }, (error) => res.status(400).json({ status: "error", error: error, message: error.message || "Unable to create Driver" }));
}