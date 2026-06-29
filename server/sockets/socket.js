import { Server } from 'socket.io';
import verifyToken from '../utilities/verifyToken.js';
import { CONVERSATION } from '../models/Conversation.js';
import mongoose from 'mongoose';
import { MESSAGE } from '../models/Message.js';
import { populate } from 'dotenv';
import authSocket from './middleware/auth.socket.js';
import registerAdminSocket from './handlers/admin.socket.js';
import registerConversationSocket from './handlers/conversation.socket.js';
import registerStockSocket from './handlers/stock.socket.js';

const setupSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: { origin: 'http://localhost:5173' },
  });

  io.use(authSocket);

  io.on('connection', async (socket) => {
    registerAdminSocket(socket);
    registerConversationSocket(io, socket);
    registerStockSocket(io, socket);

    console.log(
      `Client connected: ${socket.id} with user ${socket.user.username}`
    );

    socket.on('disconnect', (reason) => {
      console.log(
        `User disconnected, socket id: ${socket.id}, reason: ${reason}`
      );
      return;
    });
  });
};

export default setupSocket;
