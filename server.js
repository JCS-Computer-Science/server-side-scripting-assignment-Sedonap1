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
  //console.log(wordToGuess);

  //set word manually
  if (req.query.answer) {
    console.log("manually set answer");
    newGame.wordToGuess = req.query.answer;
    answer = req.query.answer;
  }

  activeSessions[newID] = newGame;

  res.status(201);
  res.send({ sessionID: newID });
});

server.get("/gamestate", (req, res) => {
  res.status(200);
  res.send({ gameState: activeSessions[req.query.sessionID] });
});

server.post("/guess", (req, res) => {
  let guess = req.body.guess;
  let sessionID = req.body.sessionID;

  if (sessionID == undefined) {
    //console.log("no session ID");
    res.status(400);
    res.send({ error: "no sesion ID provided" });
  }
  if (activeSessions[sessionID] == undefined) {
    res.status(404);
    res.send({ error: "session ID does not match any active session" });
  }

  //checks if guess only contains letters (comes back true or false)
  let onlyLetters = /^[A-Z]+$/i.test(guess);
  let gameAns = activeSessions[sessionID].wordToGuess;

  if (guess.length == 5 && onlyLetters) {
    let guessArr = guess.split("");
    let answerArr = gameAns.split("");

    let guesses = [];

    for (let i = 0; i < guessArr.length; i++) {
      if (guessArr[i] == answerArr[i]) {
        guesses.push({ value: guessArr[i], result: "RIGHT" });
      } else if (
        guessArr[i] == answerArr[0] ||
        guessArr[i] == answerArr[1] ||
        guessArr[i] == answerArr[2] ||
        guessArr[i] == answerArr[3] ||
        guessArr[i] == answerArr[4]
      ) {
        guesses.push({ value: guessArr[i], result: "CLOSE" });
      } else {
        guesses.push({ value: guessArr[i], result: "WRONG" });
      }
    }

    newGame = {
      wordToGuess: gameAns,
      guesses: [],
      wrongLetters: [],
      closeLetters: [],
      rightLetters: [],
      remainingGuesses: 6,
      gameOver: false,
    };

    newGame.guesses.push(guesses);
    console.log(newGame);

    //console.log(guesses);
    res.status(201);
    res.send({ gameState: newGame });
    res.send;
  } else {
    res.status(400);
    res.send({ error: "invalid guess" });
  }
});

//DO NOT DELETE
//getData();
module.exports = server;
