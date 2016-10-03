"use strict";

import Random from './random.js';
import GameMap from './gameMap.js';
import Character from './character.js';

const GameServer = (clientCommunicator) => {
  const communicator = clientCommunicator;
  const clientConnections = {};
  let userBets = [];
  const userStates = {};
  let lastUpdate;
  const gameMap = GameMap(3,3);

  const characters = [
    Character(communicator),
    Character(communicator)
  ]

  gameMap.populate(characters);

  const gameLoop = () => {
    const now = Date.now();
    const dt = now - lastUpdate;
    lastUpdate = now;
    update(dt);
    setTimeout(gameLoop);
  }

  const addBet = (socketId, targetId) => {
    if(userStates[socketId].gold >= 100){
      userStates[socketId].gold -= 100;
      userBets.push({socketId: socketId, targetId: targetId});
      return true;
    }
    return false;
  }

  const update = (deltaTime) => {
    for(let i=0; i<characters.length; i++) {
      characters[i].doMove(deltaTime, gameMap);
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
      }
    } else if(msgName == 'user connect') {
      userStates[msg] = {gold: 1000};
      communicator.message(socket.id, 'user state', userStates[socket.id].gold);
    } else if(msgName == 'chat message') {
      communicator.broadcast('chat message', msg);
    }
  }

  return {
    start: start,
    handle: handle
  }
}

export default GameServer;

