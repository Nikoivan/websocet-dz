import { createServer } from 'node:http';

import morgan from 'morgan';
import { Server } from 'socket.io';

import { buildApp } from './app.js';

type Message = {
  type?: string;
};

const PORT = process.env.PORT || 8080;

const app = buildApp();
const server = createServer(app);
const io = new Server(server);

io.on('connection', socket => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('message-to-message', (message: Message) => {
    message.type = 'me';

    socket.emit('message-to-me', message);
  });

  socket.on('message-to-all', (message: Message) => {
    message.type = 'all';

    socket.broadcast.emit('message-to-all', message);
    socket.emit('message-to-all', message);
  });

  const { roomName } = socket.handshake.query;

  console.log(`Received room: ${roomName}`);

  socket.join(roomName as string);

  socket.on('message-to-room', (message: Message) => {
    message.type = `roomName: ${roomName}`;

    socket.to(roomName as string).emit('message-to-room', message);
    socket.emit('message-to-room', message);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

const environment = process.env.NODE_ENV || 'development';
app.use(environment === 'development' ? morgan('dev') : morgan('tiny'));

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
