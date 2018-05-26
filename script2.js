"use strict";

var playerSelect = document.getElementsByClassName("player-select");
var boardSquares = document.getElementsByClassName("board-square");
var xScore = document.getElementById("x-score");
var oScore = document.getElementById("o-score");
var resetBtn = document.getElementById("reset");
resetBtn.onclick = reset;
//declare global variables for game world objects
var computerTurn;
var gameStarted = false;
console.log(gameStarted);
var currentGameState = {};
var human = {};
var computerAI = {};
//tracks squares that are still open
var openSquares = [];

init();
 
function init() {
  currentGameState = new GameState();  
  if (gameStarted === false) {
    human = {};
    computerAI = {};
    for(var i = 0; i < playerSelect.length; i++) {
      playerSelect[i].addEventListener("click", restartCharSelect);
    }
    gameStarted = true;
    console.log(gameStarted);
  }
  //set action to clicking of boxes and setting initial board state
  for(var i = 0; i < boardSquares.length; i++) {
    boardSquares[i].onclick = setClicked; 
    openSquares.push(boardSquares[i].id);
    currentGameState.boardState[boardSquares[i].id] = [false, undefined];
  }
  human.turnActive = true;
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
}

//click action logic
function setClicked(){
  //computerAI.turnActive is set to false to prevent player from clicking a square before computer makes a move
  if (computerAI.turnActive === false) {
    var squareId = this.id;
    // if (currentGameState.boardState[squareId][0] === false){
    if (openSquares.indexOf(squareId) !== -1){
      var winner;
      removeFromOpen(squareId);
      currentGameState.boardState[squareId][0] = true;
      currentGameState.boardState[squareId][1] = human.char;
      this.innerHTML = human.char;
      currentGameState.turnsTaken++;
      //if turns taken reaches 3, check for a winner
      if (currentGameState.turnsTaken > 4) {
        winner = currentGameState.checkForWinner(squareId, human.char);
      }
      if (winner) {
        setTimeout(reset("round"), 2000);
      } else {
        //if turns taken reaches 9 and no winner, declare a draw
        if (currentGameState.turnsTaken === 9) {
          currentGameState.checkForWinner("draw");
        }
        computerAI.turnActive = true;
        human.turnActive = false;
        computerTurn = setTimeout(computerAI.easyAI, 2000);
      }
    }
  }
}

function GameState() {
  this.turnsTaken = 0;
  this.boardState = {};
  this.checkForWinner = function(data, char) {
    if (data !== "draw") {
      var message;
      if (message = winCombination(data, char)) {
        if (char === human.char){
          alert(char + " Human wins!")
          human.wins++;
          human.scoreHolder.innerHTML = human.wins;
        } else {
          alert(char + " Computer wins!")
          computerAI.wins++;
          computerAI.scoreHolder.innerHTML = computerAI.wins;
        }
        return true;
      } else {
        return false;
      }
    } else {
      alert("draw");
    }
  }    
}

function winCombination (data, char) {
  if (data === 'a1' || data === 'a2' || data === 'a3') {
    if (horizontal1(char)) {
      return "horizontal1";
    } 
  }
  if (data === 'b1' || data === 'b2' || data === 'b3') {
    if (horizontal2(char)) {
      return "horizontal2";
    } 
  }
  if (data === 'c1' || data === 'c2' || data === 'c3') {
    if (horizontal3(char)) {
      return "horizontal3";
    } 
  }     
  if (data === 'a1' || data === 'b1' || data === 'c1') {
    if (vertical1(char)) {
      return "vertical1";
    } 
  }    
  if (data === 'a2' || data === 'b2' || data === 'c2') {
    if (vertical2(char)) {
      return "vertical2";
    } 
  }    
  if (data === 'a3' || data === 'b3' || data === 'c3') {
    if (vertical3(char)) {
      return "vertical3";
    } 
  }    
  if (data === 'a1' || data === 'b2' || data === 'c3') {
    if (diagonal1(char)) {
      return "diagonal1";
    } 
  }    
  if (data === 'a3' || data === 'b2' || data === 'c1') {
    if (diagonal2(char)) {
      return "diagonal2";
    } 
  }
}   
//winning combination logic
function horizontal1(char) {
  if (char === currentGameState.boardState.a1[1] && currentGameState.boardState.a1[1] === currentGameState.boardState.a2[1] && currentGameState.boardState.a2[1] === currentGameState.boardState.a3[1]) {
    return true;
  } else {
    return false;
  }
}
function horizontal2(char) {
  if (char === currentGameState.boardState.b1[1] && currentGameState.boardState.b1[1] === currentGameState.boardState.b2[1] && currentGameState.boardState.b2[1] === currentGameState.boardState.b3[1]) {
    return true;
  } else {
    return false;
  }
}
function horizontal3(char) {
  if (char === currentGameState.boardState.c1[1] && currentGameState.boardState.c1[1] === currentGameState.boardState.c2[1] && currentGameState.boardState.c2[1] === currentGameState.boardState.c3[1]) {
    return true;
  } else {
    return false;
  }
}
function vertical1(char) {
  if (char === currentGameState.boardState.a1[1] && currentGameState.boardState.a1[1] === currentGameState.boardState.b1[1] && currentGameState.boardState.b1[1] === currentGameState.boardState.c1[1]) {
    return true;
  } else {
    return false;
  }
}        
function vertical2(char) {
  if (char === currentGameState.boardState.a2[1] && currentGameState.boardState.a2[1] === currentGameState.boardState.b2[1] && currentGameState.boardState.b2[1] === currentGameState.boardState.c2[1]) {
    return true;
  } else {
    return false;
  }
}    
function vertical3(char) {
  if (char === currentGameState.boardState.a3[1] && currentGameState.boardState.a3[1] === currentGameState.boardState.b3[1] && currentGameState.boardState.b3[1] === currentGameState.boardState.c3[1]) {
    return true;
  } else {
    return false;
  }
}
function diagonal1(char) {
  if (char === currentGameState.boardState.a1[1] && currentGameState.boardState.a1[1] === currentGameState.boardState.b2[1] && currentGameState.boardState.b2[1] === currentGameState.boardState.c3[1]) {
    return true;
  } else {
    return false;
  }      
}    
function diagonal2(char) {
  if (char === currentGameState.boardState.a3[1] && currentGameState.boardState.a3[1] === currentGameState.boardState.b2[1] && currentGameState.boardState.b2[1] === currentGameState.boardState.c1[1]) {
    return true;
  } else {
    return false;
  }      
}



//info of board squares

//number of wins
//X or O
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
  this.easyAI = function(){
    //select random num from 0 to 8 incluside (dependent on number of squares)
    var squareNum = getRandomNum();
    //runs only if there are still open squares
    if(openSquares.length > 0) {
      var squareId = openSquares[squareNum];
      removeFromOpen(squareId);
      currentGameState.boardState[squareId][0] = true;
      currentGameState.boardState[squareId][1] = computerAI.char;
      document.getElementById(squareId).innerHTML = computerAI.char;
      if (currentGameState.turnsTaken > 4) {
        currentGameState.checkForWinner(squareId, computerAI.char);
      }
      currentGameState.turnsTaken++;
      computerAI.turnActive = false;
    }
  }
  this.hardAI = function(){
  }
  this.normalAI = function(){
  }
}

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
  if (computerTurn) {
    clearTimeout(computerTurn);
  }
  for(var i = 0; i < boardSquares.length; i++) {
    boardSquares[i].innerHTML = '';
  }
  currentGameState = {};
  if (str === "round") {
    human.turnActive = false;
    computerAI.turnActive = false;
  } else {
    gameStarted = false;
    console.log(gameStarted);
  }
  //tracks squares that are still open
  openSquares = [];
  init();
  // console.log(gameStarted);
}
//number of wins
//X or O
//active
// function Human() {
//  var char;
// }

//AI
//wins
//X or O
//active
// function Computer() {
//  var char;  
// }