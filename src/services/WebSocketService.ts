import { Server } from 'socket.io';

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
    handleNewCustomer() {
        this.socket.on('show-customer', async (data: any) => {
            try {
                this.io.emit('new_customer_signed_in', data);
            } catch (error) {
                console.error('Error handling new coordinates:', error);
            }
        });
    }
}