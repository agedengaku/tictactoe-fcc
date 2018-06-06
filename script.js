"use strict";

var playerSelect = document.getElementsByClassName("player-select");
var boardSquares = document.getElementsByClassName("board-square");
var difficultyMode = document.getElementsByClassName("difficulty-mode");
var xScore = document.getElementById("x-score");
var oScore = document.getElementById("o-score");
var resetBtn = document.getElementById("reset");
resetBtn.onclick = reset;
var computerTurnId;
var gameStarted = false;
var currentGameState = {};
var human = {};
var computerAI = {};
var openSquares = ["0", "1", "2", "3", "4", "5", "6", "7", "8"];
var selectedDifficulty;

init();
 
function init() {
  currentGameState = new GameState();  
  if (gameStarted === false) {
    human = {};
    computerAI = {};
    for(var i = 0; i < difficultyMode.length; i++) {
      difficultyMode[i].addEventListener("click", difficultyModeSelect);
    }
    for(var i = 0; i < playerSelect.length; i++) {
      playerSelect[i].addEventListener("click", charSelect);
    }
    xScore.innerHTML = '';
    oScore.innerHTML = '';
    gameStarted = true;
  }
  //set action to clicking of boxes and setting initial board state
  for(var i = 0; i < boardSquares.length; i++) {
    boardSquares[i].onclick = humanMove; 
  }
  human.turnActive = true;
}

function humanMove(){
  //computerAI.turnActive is set to false to prevent player from clicking a square before computer makes a move
  //also ensures computerAI has been instantiated and difficulty setting selected before a move can be placed
  if (computerAI.turnActive === false && computerAI.difficulty) {
    var noWinner;
    var squareId = this.id;
    if (openSquares.indexOf(squareId) !== -1){
      noWinner = moveLogic(squareId, human.char);
      if (noWinner) {
          computerAI.turnActive = true;
          human.turnActive = false;
          computerTurnId = setTimeout(computerAI.move, 2000);
      }
    }
  } else {
    console.log("Something is wrong");
    console.log("turnActive: "+computerAI.turnActive+" difficulty: "+computerAI.difficulty);
  }
}

function moveLogic(squareId, char){
  var result;
  removeFromOpen(squareId);
  currentGameState.boardState[squareId] = char;
  document.getElementById(squareId).innerHTML = char;
  currentGameState.turnsTaken++;
  if (currentGameState.turnsTaken > 4) {
    result = checkForWinner(char);
    if (result) {
      setTimeout(reset("round"), 2000);
      return false;
    } else {
      if (currentGameState.turnsTaken === 9) {
        alert("Draw");
        setTimeout(reset("round"), 2000);
        return false;
      } else {
        return true;
      }
    }
  }
  return true;
}

function checkForWinner(char) {
    if (winCombination(currentGameState.boardState, char)) {
      winScore(char);
      return true;
    } else {
      return false;
    }
}    

function winScore(char) {
  if (char === human.char){
    alert(char + " Human wins!");
    human.wins++;
    human.scoreHolder.innerHTML = human.wins;
  } else {
    alert(char + " Computer wins!")
    computerAI.wins++;
    computerAI.scoreHolder.innerHTML = computerAI.wins;
  }
}

function GameState() {
  this.turnsTaken = 0;
  this.boardState = ["0", "1", "2", "3", "4", "5", "6", "7", "8"];
}

function winCombination (board, char) {
  if (
    (char === board[0] && board[0] === board[1] && board[1] === board[2]) ||
    (char === board[3] && board[3] === board[4] && board[4] === board[5]) ||
    (char === board[6] && board[6] === board[7] && board[7] === board[8]) ||
    (char === board[0] && board[0] === board[3] && board[3] === board[6]) ||
    (char === board[1] && board[1] === board[4] && board[4] === board[7]) ||
    (char === board[2] && board[2] === board[5] && board[5] === board[8]) ||
    (char === board[0] && board[0] === board[4] && board[4] === board[8]) ||
    (char === board[2] && board[2] === board[4] && board[4] === board[6])       
    ) {
      return true;
    } else {
      return false;
    }
}   

function Player(char) {
  this.char = char;
  this.wins = 0;
  if (char === "X") {
    this.scoreHolder = xScore;
  } else {
    this.scoreHolder = oScore;
  }
  this.turnActive = false;
}

function Computer(char) {
  Player.call(this, char);
  var $that = this;  
  this.difficulty;
  this.move = function(){
    if ($that.difficulty === "Easy") {
      $that.easyAI();
    } else if ($that.difficulty === "Normal") {
      $that.normalAI();
    } else {
      $that.hardAI();
    }
  }
  this.easyAI = function(){
    var noWinner;
    //select random num from 0 to 8 incluside (dependent on number of squares)
    if(openSquares.length !== 0) {
      var squareNum = getRandomNum(openSquares.length);
      var squareId = openSquares[squareNum];
      noWinner = moveLogic(squareId, $that.char);
      if (noWinner) {
        computerAI.turnActive = false;
      }
    }
  }
  //normal mode selects randomly selects easy or hard mode on each move
  this.normalAI = function(){
    var modeSelector = getRandomNum(2);
    if (modeSelector === 0) {
      $that.easyAI();
    } else {
      $that.hardAI();
    }
  }
  //hard mode uses minimax function to ensure human never wins
  this.hardAI = function(){
    var noWinner;
    var result = minimax(currentGameState.boardState, computerAI.char).index;
    var squareId = currentGameState.boardState[result];
    noWinner = moveLogic(squareId, $that.char);
    if (noWinner) {
        computerAI.turnActive = false;
    }
  }
}
//minimax function taken from https://medium.freecodecamp.org/how-to-make-your-tic-tac-toe-game-unbeatable-by-using-the-minimax-algorithm-9d690bad4b37
//and https://codepen.io/abdolsa/pen/vgjoMb
function minimax(reboard, player) {
  var array = availableSquares(reboard);
  if (winCombination(reboard, human.char)) {
    return {
      score: -10
    };
  } else if (winCombination(reboard, computerAI.char)) {
    return {
      score: 10
    };
  } else if (array.length === 0) {
    return {
      score: 0
    };
  }

  var moves = [];
  for (var i = 0; i < array.length; i++) {
    var move = {};
    move.index = reboard[array[i]];
    reboard[array[i]] = player;

    if (player == computerAI.char) {
      var result = minimax(reboard, human.char);
      move.score = result.score;
    } else {
      var result = minimax(reboard, computerAI.char);
      move.score = result.score;
    }
    reboard[array[i]] = move.index;
    moves.push(move);
  }

  var bestMove;
  if (player === computerAI.char) {
    var bestScore = -10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = 10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];

  function availableSquares(board) {
    var result = board.filter(square => square !== "X" && square !=="O");
    return result;
  }
}

function getRandomNum(value) {
  return Math.floor(Math.random() * Math.floor(value));
}

function removeFromOpen (squareId) {
    if(openSquares.indexOf(squareId) !== -1) {
      var index = openSquares.indexOf(squareId);
      openSquares.splice(index, 1);
    }
}

function reset(str) {
  //turns off computer's move in case it was already started
  for(var i = 0; i < boardSquares.length; i++) {
    boardSquares[i].innerHTML = '';
  }
  currentGameState = {};
  if (str === "round") {
    human.turnActive = false;
    computerAI.turnActive = false;
  } else {
    gameStarted = false;
  }
  openSquares = ["0", "1", "2", "3", "4", "5", "6", "7", "8"];
  init();
}

function charSelect() {
  if (selectedDifficulty) {
    alert("You selected: " + this.innerHTML);
    human = new Player(this.innerHTML);
    if (this.innerHTML === "X") { 
      computerAI = new Computer("O");
    } else {
      computerAI = new Computer("X");
    }
    computerAI.difficulty = selectedDifficulty;
    for(var i = 0; i < playerSelect.length; i++) {
      playerSelect[i].removeEventListener("click", charSelect);
    }
  }
}

function difficultyModeSelect() {
  // if(human.char) {
    alert("You selected: " + this.innerHTML);
    selectedDifficulty = this.innerHTML;
    console.log(computerAI.difficulty);
    for(var i = 0; i < difficultyMode.length; i++) {
      difficultyMode[i].removeEventListener("click", difficultyModeSelect);
    }
  // }
}
