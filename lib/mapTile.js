const MapTile = () => {
  let occupant = null;

  const isEmpty = () => {
    return !!!occupant;
  }
  const add = (character) => {
    occupant = character
  }

  const remove = (character) => {
    if(occupant === character) {
      occupant = null;
      return true;
    }
    return false;
  }

  return {
    isEmpty: isEmpty,
    add: add,
    remove: remove
  }
}

export default MapTile;
