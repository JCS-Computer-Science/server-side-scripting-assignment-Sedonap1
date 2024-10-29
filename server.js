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

  let newGame = {
    wordToGuess: "mouse",
    guesses: [],
    wrongLetters: [],
    closeLetters: [],
    rightLetters: [],
    remainingGuesses: 6,
    gameOver: false,
  };

  let wordToGuess = newGame.wordToGuess;
  console.log(wordToGuess);

  //set word manually
  if (req.query.answer) {
    console.log("manually set answer");
    newGame.wordToGuess = req.query.answer;
  }

  activeSessions[newID] = newGame;

  res.status(201);
  res.send({ sessionID: newID });
});

server.get("/gamestate", (req, res) => {
  res.send({ gameState: activeSessions[req.query.sessionID] });
  res.status(200);
});

server.post("/guess", (req, res) => {
  let guess = req.body.guess;
  let sessionID = req.body.sessionID;

  //checks if guess only contains letters (comes back true or false)
  let onlyLetters = /^[A-Z]+$/i.test(guess);

  if (guess.length == 5 && onlyLetters) {
    res.status(201);
    //turns string into array
    let guessArr = guess.split("");
    console.log(guessArr);

    console.log(req.body);

    //let answerArr = ;

    //for (let i = 0; i < array.length; i++) {}
  } else {
    res.status(400);
    res.send({ error: "invalid guess" });
  }
});

//DO NOT DELETE
//getData();
module.exports = server;
