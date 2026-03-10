import { Server } from 'socket.io';
import verifyToken from './utilities/verifyToken.js';

const setupSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: { origin: 'http://localhost:5173' },
  });

  io.on('connection', (socket) => {
    console.log('handshake: ', socket.handshake.auth.token);
    const token = socket.handshake.auth.token;

    if (!token) {
      console.log('No auth token from handshake, disconnecting... ');
      socket.disconnect();
      return;
    }

    try {
      const user = verifyToken(token);
      console.log('AFTER HANDSHAKE USER NAME: ', user);
      if (user.isAdmin) {
        socket.join('admins');
        console.log(`${user.username} joined admins room`);
      } else {
        console.log(`${user.username} is not admin`);
      }

      socket.on('low_stock', (data) => {
        console.log('LOGS FROM LOW_STOCK EVENT: ', data);
        const title = Object.keys(data).find((key) => key !== 'bookId');
        const bookId = data.bookId;
        const stock = data[title];

        io.to('admins').emit('low_stock_warning', {
          bookId: bookId,
          message: `${stock === 0 ? `${title} is out of stock` : `${title} is low on stock`}`,
        });
      });

      console.log(`Client connected: ${socket.id} with user ${user.username}`);
    } catch (error) {
      console.log('Token invalid, disconnecting');
      socket.disconnect();
    }
    socket.on('disconnect', (reason) => {
      console.log(
        `User disconnected, socket id: ${socket.id}, reason: ${reason}`
      );
      return;
    });
  });
};

export default setupSocket;
