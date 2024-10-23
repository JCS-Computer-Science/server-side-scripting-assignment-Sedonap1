const express = require("express");
const uuid = require("uuid");
const server = express();
server.use(express.json());
server.use(express.static("public"));

//All your code goes here
let activeSessions = {};

// async function getData() {
//   let response = await fetch(
//     "https://api.dictionaryapi.dev/api/v2/entries/en/<word>"
//   );

//   let data = await response.json();
//   console.log(data);
// }

server.get("/newgame", (req, res) => {
  //generates new ID
  let newID = uuid.v4();
  console.log(newID);

  let newGame = {
    wordToGuess: "mouse",
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
  console.log(req.query.sessionID);

  res.send({ gameState: activeSessions[req.query.sessionID] });
  res.status(200);
});

server.post("/guess", (req, res) => {
  let guess = req.body.guess;
  let sessionID = req.body.sessionID;

  res.status(201);
});

//DO NOT DELETE
//getData();
module.exports = server;
