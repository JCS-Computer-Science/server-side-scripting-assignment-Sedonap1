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
  let sessionID = req.query.sessionID;

  if (sessionID == undefined) {
    //console.log("no session ID");
    res.status(400);
    res.send({ error: "no sesion ID provided" });
    return;
  }
  if (activeSessions[sessionID] == undefined) {
    res.status(404);
    res.send({ error: "session ID does not match any active session" });
    return;
  }
  res.status(200);
  res.send({ gameState: activeSessions[req.query.sessionID] });
});

server.post("/guess", (req, res) => {
  let guess = req.body.guess;
  let sessionID = req.body.sessionID;

  guess = guess.toLowerCase();

  if (sessionID == undefined) {
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
        activeSessions[sessionID].rightLetters.push(guessArr[i]);
        if (activeSessions[sessionID].rightLetters.length == 5) {
          activeSessions[sessionID].gameOver = true;
        }
      } else if (
        guessArr[i] == answerArr[0] ||
        guessArr[i] == answerArr[1] ||
        guessArr[i] == answerArr[2] ||
        guessArr[i] == answerArr[3] ||
        guessArr[i] == answerArr[4]
      ) {
        guesses.push({ value: guessArr[i], result: "CLOSE" });
        activeSessions[sessionID].closeLetters.push(guessArr[i]);
      } else {
        guesses.push({ value: guessArr[i], result: "WRONG" });
        activeSessions[sessionID].wrongLetters.push(guessArr[i]);
      }
    }

    //console.log(activeSessions[sessionID]);
    activeSessions[sessionID].remainingGuesses =
      activeSessions[sessionID].remainingGuesses - 1;

    activeSessions[sessionID].guesses.push(guesses);

    res.status(201);
    res.send({ gameState: activeSessions[sessionID] });
  } else {
    res.status(400);
    res.send({ error: "invalid guess" });
  }
});

server.delete("/reset", (req, res) => {
  let sessionID = req.query.sessionID;

  if (sessionID == undefined) {
    //console.log("no session ID");
    res.status(400);
    res.send({ error: "no sesion ID provided" });
    return;
  }
  if (activeSessions[sessionID] == undefined) {
    res.status(404);
    res.send({ error: "session ID does not match any active session" });
    return;
  }

  activeSessions[sessionID].wordToGuess = undefined;
  activeSessions[sessionID].guesses = [];
  activeSessions[sessionID].remainingGuesses = 6;
  activeSessions[sessionID].gameOver = false;
  activeSessions[sessionID].wrongLetters = [];
  activeSessions[sessionID].closeLetters = [];
  activeSessions[sessionID].rightLetters = [];

  res.status(200);
  res.send({ gameState: activeSessions[sessionID] });
});

server.delete("/delete", (req, res) => {
  let sessionID = req.query.sessionID;
  delete activeSessions[sessionID];

  if (sessionID == undefined) {
    //console.log("no session ID");
    res.status(400);
    res.send({ error: "no sesion ID provided" });
    return;
  }
  if (activeSessions[sessionID] == undefined) {
    res.status(404);
    res.send({ error: "session ID does not match any active session" });
    return;
  }
  res.status(204);
  res.send({ gameState: activeSessions });
});

//DO NOT DELETE
//getData();
module.exports = server;
