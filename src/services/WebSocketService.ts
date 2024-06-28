import { Server } from 'socket.io';
import { updateDatabaseWithCoordinates } from '../controllers/WebSocketController';
import { BusRouting, BusRoutingPassengers, IBuses } from '../models';
import { formatBusRouting } from '../routes/api/resources/BusRoutingResource';

// interface Bus {
//   id: string;
//   bus_from: { lat: number; lng: number };
//   bus_to: { lat: number; lng: number };
//   roomId: string;
// }

interface IBusInRouting {
    bus: IBuses;
    createdAt: Date;
    format(): any;
}

export class SocketHandler {
    private socket;
    private io: Server;

    constructor(socket, io: Server) {
        this.socket = socket;
        this.io = io;
    }

    /**
     * Handle new coordinates
     * @param buses 
     */
    handleNewCoordinates(buses: any) {
        this.socket.on('new-coordinates', async (data: any) => {
            try {
                await updateDatabaseWithCoordinates(data);                
                
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

                this.socket.join(data.route);
                this.io.emit('public-routing-buses', uniqueBusRoutings);
                this.io.to(data.route).emit('ongoing-buse-coordinates', buses);
            } catch (error) {
                console.error('Error handling new coordinates:', error);
            }
        });
    }

    /**
     * Handle want to go request
     * @param data
     */
    handleWantToGoRequest() {
        this.socket.on('want-to-go', async (data: { route: any, bus: any, user: any }) => {
            try {
                await BusRoutingPassengers.create({ busRouting: data.route, passenger: data.user._id });
                this.socket.join(data.route);
                this.io.to(data.route).emit(`new-passenger-for-driver-with-${data.route}`, data.user);
            } catch (error) {
                console.error('Error handling want to go request:', error);
            }
        });
    }

    /**
     * Handle join route
     * 
     * @param passengers 
     */
    handleJoinRoute(passengers: { [key: string]: string }) {
        this.socket.on('join-route', (route: string) => {
            try {
                if (passengers[this.socket.id]) {
                    this.socket.leave(passengers[this.socket.id]);
                }

                this.socket.join(route);
                passengers[this.socket.id] = route;
            } catch (error) {
                console.error('Error handling join route:', error);
            }
        });
    }
}