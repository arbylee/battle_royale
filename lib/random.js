"use strict";

const shuffle = (original_array) => {
  const array = original_array.slice(0);
  let currentIndex = array.length;
  let temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const Random = {
  shuffle: shuffle,
  randomInt: randomInt
};

export default Random;

