import { io } from 'socket.io-client';

export const socket = io('http://localhost:8000', {
  autoConnect: false,
  transports: ['websocket'],
  reconnection: false
});

// Centralized event names used across client and server
export const SOCKET_EVENTS = {
  PULL_CONVERSATIONS: 'pull_conversations',
  PULLED_CONVERSATIONS: 'pulled_conversations',
  PULL_MESSAGES: 'pull_messages',
  PULLED_MESSAGES: 'pulled_messages',
  SEND_MESSAGE: 'send_message',
  NEW_MESSAGE: 'new_message'
};
