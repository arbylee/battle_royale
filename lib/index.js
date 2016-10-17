import ClientCommunicator from './clientCommunicator';
import GameServer from './gameServer';
"use strict";

const clientCommunicator = ClientCommunicator();
const gameServer = GameServer(clientCommunicator);

gameServer.start();
