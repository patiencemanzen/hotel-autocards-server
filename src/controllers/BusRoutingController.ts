/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { tryCatch } from "../helpers/general-helpers";
import { Request, Response } from "express";
import { Buses, BusRouting } from "../models";

/**
 * Controller function for initializing Bus Routing
 * 
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const init = async (req: Request, res: Response) => {
    return tryCatch(async () => {
        const { from, to, bus } = req.body;

        const currentBus = await Buses.findOne({ _id: bus });

        if (!currentBus) return res.status(400).json({ status: "error", message: "Bus not found" });

        const busRouting = await BusRouting.create({ bus: currentBus._id, cordinates: from, bus_from: from, bus_to: to });

        return res.status(200).json({ status: "success", message: "Bus Routing created successfully", data: busRouting });
    }, (error) => res.status(400).json({ status: "error", error: error, message: error.message || "Unable to fetch Databases" }));
}