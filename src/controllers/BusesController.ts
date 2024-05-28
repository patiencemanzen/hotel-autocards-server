/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { validationResult } from "express-validator";
import { tryCatch } from "../helpers/general-helpers";
import { Buses, BusRoute, Drivers } from "../models";
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
        await BusRoute.create({ bus: bus._id });

        res.status(201).json({ status: "success", data: bus, message: "Bus created successfully" });
    }, (error) => res.status(400).json({ status: "error", error: error, message: error.message || "Unable to create Bus" }));
}

/**
 * Controller function for assigning routes to buses
 * 
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns
 */
export const assignRoutes = async (req: Request, res: Response) => {
    return tryCatch(async () => {
        const { bus } = req.params;
        const { from, to } = req.body;

        const currentBus = await Buses.findOne({ _id: bus });

        if (!currentBus) return res.status(400).json({ status: "error", message: "Bus not found" });

        const busRoute = await BusRoute.findOneAndUpdate({ bus: bus }, { from: from, to: to }, { new: true });
        
        return res.status(200).json({ status: "success", message: "Bus Route assigned successfully", data: busRoute });
    }, (error) => res.status(400).json({ status: "error", error: error, message: error.message || "Unable to Update bus route" }));
}