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

  let answer;

  //set word manually
  if (req.query.answer) {
    console.log("manually set answer");
    newGame.wordToGuess = req.query.answer;
    answer = req.query.answer;
  }
  // else {
  //   answer = newGame.wordToGuess;
  //   res.send({ answer: answer });
  // }
  //console.log(newGame.wordToGuess);

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
    res.status(201);
    //turns guess into array
    let guessArr = guess.split("");
    console.log(guessArr);

    //turn answer into array
    let answerArr = gameAns.split("");
    console.log(gameAns);

    res.send();
    let game = [];

    for (let i = 0; i < guessArr.length; i++) {
      if (guessArr[i] == answerArr[i]) {
        game.push({ value: guessArr, result: "RIGHT" });
        console.log(game);
      }
    }
  } else {
    res.status(400);
    res.send({ error: "invalid guess" });
  }
});

//DO NOT DELETE
//getData();
module.exports = server;
