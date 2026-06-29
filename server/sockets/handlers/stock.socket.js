import { STOCK_EVENTS } from '../events/stock.event.js';

export default function registerStockSocket(io, socket) {
  socket.on(STOCK_EVENTS.LOW_STOCK, (data) => {
    console.log('LOGS FROM LOW_STOCK EVENT: ', data);
    const title = Object.keys(data).find((key) => key !== 'bookId');
    const bookId = data.bookId;
    const stock = data[title];

    io.to('admins').emit(STOCK_EVENTS.LOW_STOCK_WARNING, {
      bookId: bookId,
      message: `${stock === 0 ? `${title} is out of stock` : `${title} is low on stock`}`,
    });
  });
}
