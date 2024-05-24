import { Server } from 'socket.io';
import { updateDatabaseWithCoordinates } from '../controllers/WebSocketController';

interface Bus {
  route: string;
  bus_from: { lat: number; lng: number };
  bus_to: { lat: number; lng: number };
  roomId: string;
}

interface CoordinateData extends Bus {
  coordinates: { lat: number; lng: number };
}

export class SocketHandler {
    private socket;
    private io: Server;
    private busesWithRoomIds: Bus[] = [];

    constructor(socket, io: Server) {
        this.socket = socket;
        this.io = io;
    }

    /**
     * Handle new coordinates
     * @param buses 
     */
    handleNewCoordinates(buses: Bus[]) {
        this.socket.on('new-coordinates', (data: CoordinateData) => {
            try {
                updateDatabaseWithCoordinates(data);

                let bus = buses.find(bus => bus.route === data.route);
                
                if (bus) {
                    bus.bus_from = data.bus_from;
                    bus.bus_to = data.bus_to;
                } else {
                    const newBus = { ...data, roomId: data.route };
                    buses.push(newBus);
                    this.busesWithRoomIds.push(newBus);
                }

                this.socket.join(data.route);
                this.io.emit('public-routing-buses', this.busesWithRoomIds);
                this.io.to(data.route).emit('ongoing-buse-coordinates', buses);
            } catch (error) {
                console.error('Error handling new coordinates:', error);
            }
        });
    }

    handleWantToGoRequest() {
        this.socket.on('want-to-go', (data: { bus: Bus, user: any }) => {
            try {
                this.socket.join(data.bus.route);
                this.io.to(data.bus.route).emit(`new-passenger-for-driver-with-${data.bus.route}`, data.user);
            } catch (error) {
                console.error('Error handling want to go request:', error);
            }
        });
    }

    /**
     * Handle join route
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