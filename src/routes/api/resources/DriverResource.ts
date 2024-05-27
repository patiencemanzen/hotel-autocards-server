export const formatDriver = (driver: any) => {
    return {
        id: driver._id,
        name: driver.name,
        desciption: driver.desciption,
        lisence: driver.lisence,
        createdAt: driver.createdAt,
    };
}