import MapTile from './mapTile.js';
import Random from './random.js';

const GameMap = (width, height) => {
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
  }

  return {
    inspect: inspect,
    populate: populate
  }
}

export default GameMap;
