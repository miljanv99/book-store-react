export default function registerAdminSocket(socket) {
  try {
    if (socket.user.isAdmin) {
      socket.join('admins');
      console.log(`${socket.user.username} joined admins room`);
    } else {
      console.log(`${socket.user?.username} is not admin`);
    }
  } catch (error) {
    console.log('Something went wrong', error);
  }
}
