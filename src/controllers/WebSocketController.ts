import { BusRouting } from "../models";
import { formatBusRouting } from "../routes/api/resources/BusRoutingResource";

export const updateDatabaseWithCoordinates = async (data: any) => {
    const { route, coordinates } = data;
    const routing = await BusRouting.findOne({ _id: route }).populate("bus");

    if (!routing) return "Bus Route not found";

    routing.coordinates = coordinates;
    routing.save();

    return formatBusRouting(routing);
}