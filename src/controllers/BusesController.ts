/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { validationResult } from "express-validator";
import { tryCatch } from "../helpers/general-helpers";
import { Buses, Drivers } from "../models";
import { Request, Response } from "express";

/**
 * Controller function for Buses creation
 * 
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const store = async (req: Request, res: Response) => {
    return tryCatch(async () => {
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(422).json({ status: "error", errors: errors.array(), message: "Validation failed" });

        const { name, driver, description, plate_number, type, capacity } = req.body;

        const currentDriver = await Drivers.findOne({ _id: driver });

        if (!currentDriver) return res.status(404).json({ status: "error", message: "Driver not found" });

        const bus = await Buses.create({ name, driver, description, plate_number, type, capacity });

        res.status(201).json({ status: "success", data: bus, message: "Bus created successfully" });
    }, (error) => res.status(400).json({ status: "error", error: error, message: error.message || "Unable to create Bus" }));
}