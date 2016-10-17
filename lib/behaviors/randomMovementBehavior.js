"use strict";

import Random from '../random.js';
import { MOVEMENT_DIRECTIONS } from '../character.js';

const RandomMovementBehavior = () => {
  const doMove = (deltaTime, character) => {
    character.move(deltaTime, MOVEMENT_DIRECTIONS[Random.randomInt(0, 3)]);
  }

  return {
    doMove: doMove
  }
}

export default RandomMovementBehavior;
