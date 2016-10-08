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

  const displayState = () => {
    return isEmpty();
  }

  return {
    isEmpty: isEmpty,
    add: add,
    remove: remove,
    displayState: displayState
  }
}

export default MapTile;
