const Character = (communicator) => {
  let currentX, currentY;
  const attackDelay = 1000;
  let attackDelayLeft = 1000;
  const attack = (deltaTime) => {
    if(attackDelayLeft > 0){
      attackDelayLeft -= deltaTime;
      return;
    }

    attackDelayLeft = attackDelay;
    communicator.broadcast("chat message", "I attacked");
  }

  const setPosition = (x, y) => {
    currentX = x;
    currentY = y;
  }

  const doMove = (gameMap) => {
    attack();
  }

  return {
    doMove: attack,
    setPosition: setPosition
  };
}
export default Character;
