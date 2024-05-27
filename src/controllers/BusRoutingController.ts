/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { tryCatch } from "../helpers/general-helpers";
import { Request, Response } from "express";
import { Buses, BusRouting, IBuses } from "../models";
import { formatBusRouting } from "../routes/api/resources/BusRoutingResource";

interface IBusInRouting {
    bus: IBuses;
    createdAt: Date;
    format(): any;
}

/**
 * Controller function for initializing Bus Routing
 * 
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const init = async (req: Request, res: Response) => {
    return tryCatch(async () => {
        const { from, to, bus, coordinates } = req.body;

        const currentBus = await Buses.findOne({ _id: bus });

        if (!currentBus) return res.status(400).json({ status: "error", message: "Bus not found" });

        const busRouting = await BusRouting.create({ bus: currentBus._id, coordinates: coordinates, bus_from: from, bus_to: to });
        const populated = await BusRouting.findById(busRouting._id).populate("bus");        
        const formattedBusRouting = formatBusRouting(populated);

        return res.status(200).json({ status: "success", message: "Bus Routing created successfully", data: formattedBusRouting });
    }, (error) => res.status(400).json({ status: "error", error: error, message: error.message || "Unable to fetch Databases" }));
}

/**
 * Controller function for fetching all bus routings
 * 
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const getInRoutings = async (_req: Request, res: Response) => {
    return tryCatch(async () => {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date(startOfToday);
        endOfToday.setDate(endOfToday.getDate() + 1);

        let busRoutings: IBusInRouting[] = await BusRouting.find({ createdAt: { $gte: startOfToday, $lt: endOfToday }});
        busRoutings = busRoutings.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        const uniqueBusRoutings = busRoutings.filter((busRouting: IBusInRouting, index: number, self: IBusInRouting[]) =>
            index === self.findIndex((t: IBusInRouting) => (
                t.bus.toString() === busRouting.bus.toString()
            ))
        ).map((busRouting: IBusInRouting) => formatBusRouting(busRouting));
          
        return res.status(200).json({ status: "success", message: "Bus Routings fetched successfully", data: uniqueBusRoutings });
    }, (error) => res.status(400).json({ status: "error", error: error, message: error.message || "Unable to fetch Databases" }));
}