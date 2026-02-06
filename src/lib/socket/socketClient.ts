import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function initializeSocket(token: string): Socket {
  if (socket?.connected) {
    return socket;
  }

  const socketUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

  socket = io(socketUrl, {
    auth: {
      token,
    },
    autoConnect: false,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  return socket;
}

export function getSocket(): Socket | null {
  return socket;
}

export function disconnectSocket(): void {
  if (socket?.connected) {
    socket.disconnect();
  }
  socket = null;
}
