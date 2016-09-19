"use strict";

const ClientCommunicator = () => {
  const io = require('socket.io')();
  io.listen(3001);

  const start = (server) => {
    io.on('connection', (socket) => {
      server.handle(socket, 'user connect', socket.id)
      socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
      });

      socket.on('user action', (msg) => {
        server.handle(socket, 'user action', msg);
      });
    });
  }

  const broadcast = (topic, msg) => {
    io.emit(topic, msg);
  }

  return {
    start: start,
    broadcast: broadcast
  };
}

export default ClientCommunicator;
