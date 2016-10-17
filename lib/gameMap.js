import MapTile from './mapTile.js';
import Random from './random.js';

const GameMap = (communicator, width, height) => {
  var Canvas = require('canvas')
    , canvas = new Canvas(800, 800)
    , ctx = canvas.getContext('2d');

  let board = [];
  for(let i=0; i<height; i++) {
    let currentRow = [];
    for(let j=0; j<width; j++) {
      currentRow.push(MapTile());
    }
    board.push(currentRow);
  }

  const inspect = () => {
    return board;
  }

  const populate = (characters) => {
    for(let i=0; i<characters.length; i++){
      let placedCharacter = false;
      let currentCharacter = characters[i];
      while(!placedCharacter){
        let randomX = Random.randomInt(0, width-1);
        let randomY = Random.randomInt(0, height-1);
        if(board[randomY][randomX].isEmpty()){
          board[randomY][randomX].add(currentCharacter);
          currentCharacter.setPosition(randomX, randomY);
          placedCharacter = true;
        }
      }
    }
    communicator.broadcast('map state', displayState());
  }

  const displayState = () => {
    let boardState = [];
    for(let i=0; i<height; i++) {
      let rowState = [];
      for(let j=0; j<width; j++) {
        if(board[i][j].isEmpty()){
          ctx.fillStyle = '#BBB';
        } else {
          ctx.fillStyle = '#09F';
        }
        ctx.fillRect(j*10,i*10,5,5);
      }
    }
    return canvas.toBuffer();
  }

  const move = (character, direction) => {
    const position = character.getPosition();
    board[position.y][position.x].remove(character);
    const futurePos = getFuturePosition(position, direction);
    board[futurePos.y][futurePos.x].add(character);
    character.setPosition(futurePos.x, futurePos.y);
    communicator.broadcast('map state', displayState());
  }

  const getFuturePosition = (position, direction) => {
    let x = position.x;
    let y = position.y;

    if(direction === 'N') {
      y = y-1;
    } else if(direction === 'S') {
      y = y+1;
    } else if(direction === 'E') {
      x = x+1;
    } else if(direction === 'W') {
      x = x-1;
    }

    if(y >= height-1) {
      y = 0;
    } else if(y < 0) {
      y = height-1;
    }

    if(x >= width-1) {
      x = 0;
    } else if (x < 0) {
      x = width-1;
    }

    return {x: x, y: y}
  }

  return {
    inspect: inspect,
    populate: populate,
    move: move
  }
}

export default GameMap;
