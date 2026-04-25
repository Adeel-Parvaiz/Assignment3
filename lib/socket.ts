import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

// Get or create socket connection
export function getSocket(): Socket {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', {
      path: '/api/socketio',
    });
  }
  return socket;
}

// Disconnect socket (cleanup)
export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}