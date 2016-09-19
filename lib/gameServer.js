"use strict";

import Random from './random.js';

const GameServer = (clientCommunicator) => {
  const communicator = clientCommunicator;
  const clientConnections = {};
  let userBets = [];
  const userStates = {};
  let lastUpdate;

  const gameLoop = () => {
    const now = Date.now();
    const dt = now - lastUpdate;
    lastUpdate = now;
    update(dt);
    setTimeout(gameLoop);
  }

  const participants = [
    {id: 1, name: "Jam"},
    {id: 2, name: "Morning Fresh"},
    {id: 3, name: "Lune"},
    {id: 4, name: "Pixie"},
    {id: 5, name: "Madden"},
    {id: 6, name: "Oscar"},
    {id: 7, name: "Vitesse"},
    {id: 8, name: "Pharoah"},
    {id: 9, name: "Elsa"}
  ]

  const addBet = (socketId, targetId) => {
    if(userStates[socketId].gold >= 100){
      userStates[socketId].gold -= 100;
      userBets.push({socketId: socketId, targetId: targetId});
      return true;
    }
    return false;
  }

  const timeBetweenRounds = 3000;
  let timeSinceLastRound = 3000;

  const update = (deltaTime) => {
    timeSinceLastRound -= deltaTime;
    if(timeSinceLastRound <= 0){
      const results = Random.shuffle(participants);
      const resultNames = [];
      for(let i=0; i<results.length; i++){
        resultNames.push(results[i].name);
      }
      communicator.broadcast('chat message', "Time's Up!");
      communicator.broadcast('chat message', 'Results: ' + resultNames.join(', '));
      for(let i=0; i<userBets.length; i++){
        const socketId = userBets[i].socketId;
        if(results[0].id == userBets[i].targetId){
          userStates[socketId].gold += 250;
          communicator.broadcast('chat message', socketId + " won a bet");
          communicator.message(socketId, 'user state', userStates[socketId].gold);
        }
      }
      userBets = [];
      timeSinceLastRound = timeBetweenRounds;
    }
  }

  const start = (gs) => {
    //communicator.start(this);
    //TODO: Why doesn't "this" reference the gameServer?
    communicator.start(gs);
    lastUpdate = Date.now();
    gameLoop();
  }

  const handle = (socket, msgName, msg) => {
    if(msgName == 'user action'){
      if(addBet(socket.id, msg)){
        socket.emit('user state', userStates[socket.id].gold);
        communicator.broadcast('user action', socket.id + " placed a bet on " + participants[Number(msg) - 1].name);
      }
    } else if(msgName == 'user connect') {
      userStates[msg] = {gold: 1000};
      communicator.message(socket.id, 'user state', userStates[socket.id].gold);
    }
  }

  return {
    start: start,
    handle: handle
  }
}

export default GameServer;

