import verifyToken from '../../utilities/verifyToken.js';

export default function authSocket(socket, next) {
  const token = socket.handshake.auth.token;

  try {
    if (!token) {
      console.log('No auth token from handshake, disconnecting... ');
      socket.disconnect();
      return;
    }

    const user = verifyToken(token);
    console.log('AFTER HANDSHAKE USER NAME: ', user);
    socket.user = user;
    next();
  } catch (error) {
    console.log('Token invalid, disconnecting: ', error);
    socket.disconnect();
  }
}
