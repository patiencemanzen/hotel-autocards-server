import { formatDriver } from "./DriverResource";

export const formatBus = (bus: any) => {
    return {
        id: bus._id,
        name: bus.name,
        driver: formatDriver(bus.driver),
        description: bus.description,
        plate_number: bus.plate_number,
        type: bus.type,
        capacity: bus.capacity,
        createdAt: bus.createdAt,
    };
}