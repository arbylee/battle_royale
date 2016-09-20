"use strict";

const ClientCommunicator = () => {
  const io = require('socket.io')();
  io.listen(process.env.PORT || 3001);

  const clients = {};
  const start = (server) => {
    io.on('connection', (socket) => {
      clients[socket.id] = socket;

      server.handle(socket, 'user connect', socket.id)
      socket.on('chat message', (msg) => {
        server.handle(socket, 'chat message', msg);
      });

      socket.on('user action', (msg) => {
        server.handle(socket, 'user action', msg);
      });
    });
  }

  const broadcast = (topic, msg) => {
    io.emit(topic, msg);
  }

  const message = (clientId, topic, msg) => {
    clients[clientId].emit(topic, msg);
  }

  return {
    start: start,
    broadcast: broadcast,
    message: message
  };
}

export default ClientCommunicator;
