import { formatBus } from "./BusResource";

export const formatBusRouting = (busRouting: any) => {
    return {
        id: busRouting._id,
        bus: formatBus(busRouting.bus),
        bus_from: busRouting.bus_from,
        bus_to: busRouting.bus_to,
        coordinates: busRouting.coordinates,
        roomId: busRouting._id,
        createdAt: busRouting.createdAt,
    };
}