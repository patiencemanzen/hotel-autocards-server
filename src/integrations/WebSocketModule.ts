import { Server } from 'socket.io';

/**
 * Create a new WebSocket server
 * @param server 
 * @returns 
 */
export const createWebSocket = (server) => {
    return new Server(server, {
        cors: {
          origin: "*",
          methods: ["GET", "POST"]
        }
    }); 
}

/**
 * Handle socket connection
 * @param webSocket 
 * @param callback 
 */
export const handleSocketConnection = (webSocket: { on: (arg0: string, arg1: (socket: any) => any) => void; }, callback: (arg0: any) => any) => {
    webSocket.on('connection', (socket) => {
        console.log(`Socket ${socket.id} connected`)
        return callback(socket);
    });
};

/**
 * Handle socket disconnection
 * @param io 
 * @param callback 
 */
export const handleSocketDisconnection = (webSocket: { on: (arg0: string, arg1: (socket: any) => any) => void; }, callback: (arg0: any) => any) => {
    webSocket.on('disconnect', (socket) => {
        console.log(`Socket ${socket.id} disconnected`)
        return callback(socket);
    });
};
