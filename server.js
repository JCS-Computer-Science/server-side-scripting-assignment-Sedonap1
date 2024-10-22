const express = require("express");
const uuid = require("uuid");
const server = express();
server.use(express.json());
server.use(express.static("public"));

//All your code goes here
let activeSessions = {};

//string with path, new endpoint will always start with server.nfksdjbf
server.get("/newgame", (req, res) => {
  let newID = uuid.v4();
  console.log(newID);

  let newGame = {
    wordToGuess: "apple",
    guesses: [],
    wrongLetters: [],
    closeLetters: [],
    rightLetters: [],
    remainingGuesses: 6,
    gameOver: false,
  };

  activeSessions[newID] = newGame;

  res.status(201);
  res.send({ sessionID: newID });
});

server.get("/gamestate", (req, res) => {
  console.log(req.newGame);

  res.status(200);
  res.send({ gameState: req.query.newGame });
  //res.send({ gameState: req.newGame });
});

//Do not remove this line. This allows the test suite to start
//multiple instances of your server on different ports
module.exports = server;
