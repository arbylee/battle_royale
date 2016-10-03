const MapTile = () => {
  let occupant = null;

  const isEmpty = () => {
    return !!!occupant;
  }
  const add = (character) => {
    occupant = character
  }

  return {
    isEmpty: isEmpty,
    add: add
  }
}

export default MapTile;
