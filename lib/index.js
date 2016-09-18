"use strict";

const io = require('socket.io')();
io.listen(3001);

let userBets = [];
const userStates = {};

io.on('connection', (socket) => {
  userStates[socket.id] = {gold: 1000};
  socket.emit('user state', userStates[socket.id].gold);

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('user action', (msg) => {
    if(addBet(socket.id, msg)){
      socket.emit('user state', userStates[socket.id].gold);
      io.emit('user action', socket.id + " placed a bet on " + participants[Number(msg) - 1].name);
    }
  });
});

let lastUpdate = Date.now();

const gameLoop = () => {
  const now = Date.now();
  const dt = now - lastUpdate;
  lastUpdate = now;
  update(dt);
  setTimeout(gameLoop);
}

const participants = [
  {id: 1, name: "Jam"},
  {id: 2, name: "Morning Fresh"},
  {id: 3, name: "Lune"},
  {id: 4, name: "Pixie"},
  {id: 5, name: "Madden"},
  {id: 6, name: "Oscar"},
  {id: 7, name: "Vitesse"},
  {id: 8, name: "Pharoah"},
  {id: 9, name: "Elsa"}
]

const addBet = (socketId, targetId) => {
  if(userStates[socketId].gold >= 100){
    userStates[socketId].gold -= 100;
    userBets.push({socketId: socketId, targetId: targetId});
    return true;
  }
  return false;
}

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

const timeBetweenRounds = 3000;
let timeSinceLastRound = 3000;

const update = (deltaTime) => {
  timeSinceLastRound -= deltaTime;
  if(timeSinceLastRound <= 0){
    const results = shuffle(participants);
    const resultNames = [];
    for(let i=0; i<results.length; i++){
      resultNames.push(results[i].name);
    }
    io.emit('chat message', "Time's Up!");
    io.emit('chat message', "Results: " + resultNames.join(", "));
    for(let i=0; i<userBets.length; i++){
      const socketId = userBets[i].socketId;
      if(results[0].id == userBets[i].targetId){
        userStates[socketId].gold += 250;
        io.emit('chat message', socketId + " won a bet");
        //socket.emit('user state', userStates[socket.id].gold); // Need to be able to fetch specific socket id
      }
    }
    userBets = [];
    timeSinceLastRound = timeBetweenRounds;
  }
}

gameLoop();
