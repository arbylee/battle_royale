"use strict";
import Random from './random.js';

const Character = (communicator) => {
  let currentGameMap;
  let currentX, currentY;
  const attackDelay = 1000;
  let attackDelayLeft = 1000;
  const moveDelay = 1000;
  let moveDelayLeft = 1000;
  const DIRECTIONS = ['N', 'E', 'S', 'W'];

  const attack = (deltaTime) => {
    if(attackDelayLeft > 0){
      attackDelayLeft -= deltaTime;
      return;
    }

    attackDelayLeft = attackDelay;
    communicator.broadcast("chat message", "I attacked");
  }

  const move = function(deltaTime, direction) {
    if(moveDelayLeft > 0) {
      moveDelayLeft -= deltaTime;
      return;
    }
    moveDelayLeft = moveDelay;
    currentGameMap.move(this, direction);
    communicator.broadcast('chat message', currentX + ' ' + currentY)
  }

  const setPosition = (x, y) => {
    currentX = x;
    currentY = y;
  }

  const doMove = function(deltaTime, gameMap) {
    currentGameMap = gameMap;
    this.move(deltaTime, DIRECTIONS[Random.randomInt(0, 3)]);
  }

  const getPosition = () => {
    return {x: currentX, y: currentY};
  }

  return {
    doMove: doMove,
    setPosition: setPosition,
    getPosition: getPosition,
    move: move
  };
}
export default Character;
