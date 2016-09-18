var io = require('socket.io')();
io.listen(3001);

var userBets = [];
var userStates = {};

io.on('connection', function(socket){
  userStates[socket.id] = {gold: 1000};
  socket.emit('user state', userStates[socket.id].gold);

  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });

  socket.on('user action', function(msg){
    if(addBet(socket.id, msg)){
      socket.emit('user state', userStates[socket.id].gold);
      io.emit('user action', socket.id + " placed a bet on " + participants[Number(msg) - 1].name);
    }
  });
});

var lastUpdate = Date.now();

function gameLoop(){
  var now = Date.now();
  var dt = now - lastUpdate;
  lastUpdate = now;
  update(dt);
  setTimeout(gameLoop);
}

var participants = [
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

function addBet(socketId, targetId){
  if(userStates[socketId].gold >= 100){
    userStates[socketId].gold -= 100;
    userBets.push({socketId: socketId, targetId: targetId});
    return true;
  }
  return false;
}

function shuffle(original_array) {
  var array = original_array.slice(0);
  var currentIndex = array.length, temporaryValue, randomIndex;

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

var timeBetweenRounds = 3000;
var timeSinceLastRound = 3000;

function update(deltaTime){
  timeSinceLastRound -= deltaTime;
  if(timeSinceLastRound <= 0){
    var results = shuffle(participants);
    var resultNames = [];
    for(i=0; i<results.length; i++){
      resultNames.push(results[i].name);
    }
    io.emit('chat message', "Time's Up!");
    io.emit('chat message', "Results: " + resultNames.join(", "));
    for(i=0; i<userBets.length; i++){
      var socketId = userBets[i].socketId;
      if(results[0].id == userBets[i].targetId){
        userStates[socketId].gold += 250;
        io.emit('chat message', socketId + " won a bet");
      }
    }
    userBets = [];
    timeSinceLastRound = timeBetweenRounds;
  }
}

gameLoop();
