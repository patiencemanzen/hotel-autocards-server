import { tryCatch } from "../helpers/general-helpers";
import { BusRouting } from "../models";

export const updateDatabaseWithCoordinates = (data) => {
    return tryCatch(async () => {
        const { route, cordinates, bus_from, bus_to } = data;
        const routing = await BusRouting.findOne({ _id: route });

        if (!routing) return "Bus Route not found";

        routing.cordinates = cordinates;
        routing.bus_from = bus_from;
        routing.bus_to = bus_to;
        
        routing.save();
    }, () =>  "Unable to fetch Databases");
}