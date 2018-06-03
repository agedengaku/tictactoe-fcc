(function() {
"use strict";

var playerSelect = document.getElementsByClassName("player-select");
var boardSquares = document.getElementsByClassName("board-square");
var xScore = document.getElementById("x-score");
var oScore = document.getElementById("o-score");
var resetBtn = document.getElementById("reset");
resetBtn.onclick = reset;
var computerTurnId;
var gameStarted = false;
var currentGameState = {};
var human = {};
var computerAI = {};
//tracks squares that are still open
var openSquares = ["0", "1", "2", "3", "4", "5", "6", "7", "8"];

init();
 
function init() {
  currentGameState = new GameState();  
  if (gameStarted === false) {
    human = {};
    computerAI = {};
    for(var i = 0; i < playerSelect.length; i++) {
      playerSelect[i].addEventListener("click", restartCharSelect);
    }
    xScore.innerHTML = '';
    oScore.innerHTML = '';
    gameStarted = true;
  }
  //set action to clicking of boxes and setting initial board state
  for(var i = 0; i < boardSquares.length; i++) {
    boardSquares[i].onclick = humanMove; 
    // openSquares.push(boardSquares[i].id);
    // currentGameState.boardState[boardSquares[i].id] = [false, undefined];
  }
  human.turnActive = true;
}

function humanMove(){
  //computerAI.turnActive is set to false to prevent player from clicking a square before computer makes a move
  if (computerAI.turnActive === false) {
    var noWinner;
    var squareId = this.id;
    if (openSquares.indexOf(squareId) !== -1){
      noWinner = moveLogic(squareId, human.char);
      if (noWinner) {
          computerAI.turnActive = true;
          human.turnActive = false;
          computerTurnId = setTimeout(computerAI.easyAI, 2000);
          // computerTurnId = setTimeout(computerAI.hardAI, 2000);
      }
    }
  }
}

function moveLogic(squareId, char){
  var result;
  removeFromOpen(squareId);
  // currentGameState.boardState[squareId][0] = true;
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
    if (winCombination(char)) {
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

function winCombination (char) {
  if (
    (char === currentGameState.boardState[0] && currentGameState.boardState[0] === currentGameState.boardState[1] && currentGameState.boardState[2]) ||
    (char === currentGameState.boardState[3] && currentGameState.boardState[3] === currentGameState.boardState[4] && currentGameState.boardState[5]) ||
    (char === currentGameState.boardState[6] && currentGameState.boardState[6] === currentGameState.boardState[7] && currentGameState.boardState[8]) ||
    (char === currentGameState.boardState[0] && currentGameState.boardState[0] === currentGameState.boardState[3] && currentGameState.boardState[6]) ||
    (char === currentGameState.boardState[1] && currentGameState.boardState[1] === currentGameState.boardState[4] && currentGameState.boardState[7]) ||
    (char === currentGameState.boardState[2] && currentGameState.boardState[2] === currentGameState.boardState[5] && currentGameState.boardState[8]) ||
    (char === currentGameState.boardState[0] && currentGameState.boardState[0] === currentGameState.boardState[4] && currentGameState.boardState[8]) ||
    (char === currentGameState.boardState[2] && currentGameState.boardState[2] === currentGameState.boardState[4] && currentGameState.boardState[6])       
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
  this.easyAI = function(){
    var noWinner;
    //select random num from 0 to 8 incluside (dependent on number of squares)
    if(openSquares.length !== 0) {
      var squareNum = getRandomNum();
      squareNum = squareNum.toString();
      noWinner = moveLogic(squareNum, $that.char);
      if (noWinner) {
        computerAI.turnActive = false;
      }
    }
  }
  this.hardAI = function(){
    // minimax(openSquares);
  }
  this.normalAI = function(){
  }
}

// function minimax(reboard, player) {
//   iter++;
//   let array = avail(reboard);
//   if (winning(reboard, huPlayer)) {
//     return {
//       score: -10
//     };
//   } else if (winning(reboard, aiPlayer)) {
//     return {
//       score: 10
//     };
//   } else if (array.length === 0) {
//     return {
//       score: 0
//     };
//   }

//   var moves = [];
//   for (var i = 0; i < array.length; i++) {
//     var move = {};
//     move.index = reboard[array[i]];
//     reboard[array[i]] = player;

//     if (player == aiPlayer) {
//       var g = minimax(reboard, huPlayer);
//       move.score = g.score;
//     } else {
//       var g = minimax(reboard, aiPlayer);
//       move.score = g.score;
//     }
//     reboard[array[i]] = move.index;
//     moves.push(move);
//   }

//   var bestMove;
//   if (player === aiPlayer) {
//     var bestScore = -10000;
//     for (var i = 0; i < moves.length; i++) {
//       if (moves[i].score > bestScore) {
//         bestScore = moves[i].score;
//         bestMove = i;
//       }
//     }
//   } else {
//     var bestScore = 10000;
//     for (var i = 0; i < moves.length; i++) {
//       if (moves[i].score < bestScore) {
//         bestScore = moves[i].score;
//         bestMove = i;
//       }
//     }
//   }
//   return moves[bestMove];
// }


function getRandomNum() {
  return Math.floor(Math.random() * Math.floor(openSquares.length));
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
  //tracks squares that are still open
  openSquares = ["1", "2", "3", "4", "5", "6", "7", "8"];
  init();
}

function restartCharSelect() {
  alert("You selected: " + this.innerHTML);
  human = new Player(this.innerHTML);
  if (this.innerHTML === "X") { 
    computerAI = new Computer("O");
  } else {
    computerAI = new Computer("X");
  }
  for(var i = 0; i < playerSelect.length; i++) {
    playerSelect[i].removeEventListener("click", restartCharSelect);
  }
}})();
