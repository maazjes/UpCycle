import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '../types';

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://192.168.0.104:8080', { path: '/api/chat', autoConnect: false });

socket.onAny((event, ...args): void => {
  console.log(event, args);
});

export default socket;
