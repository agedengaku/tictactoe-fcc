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
    xScore.innerHTML = '';
    oScore.innerHTML = '';
    gameStarted = true;
  }
  //set action to clicking of boxes and setting initial board state
  for(var i = 0; i < boardSquares.length; i++) {
    boardSquares[i].onclick = humanMove; 
    openSquares.push(boardSquares[i].id);
    currentGameState.boardState[boardSquares[i].id] = [false, undefined];
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
      }
    }
  }
}

function moveLogic(squareId, char){
  var result;
  removeFromOpen(squareId);
  currentGameState.boardState[squareId][0] = true;
  currentGameState.boardState[squareId][1] = char;
  document.getElementById(squareId).innerHTML = char;
  currentGameState.turnsTaken++;
  if (currentGameState.turnsTaken > 4) {
    result = checkForWinner(squareId, char);
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

function checkForWinner(data, char) {
    if (winCombination(data, char)) {
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
  this.boardState = {};
}

function winCombination (data, char) {
  if (data === 'a1' || data === 'a2' || data === 'a3') {
    if (horizontal1(char)) {
      return true;
    } 
  }
  if (data === 'b1' || data === 'b2' || data === 'b3') {
    if (horizontal2(char)) {
      return true;
    } 
  }
  if (data === 'c1' || data === 'c2' || data === 'c3') {
    if (horizontal3(char)) {
      return true;
    } 
  }     
  if (data === 'a1' || data === 'b1' || data === 'c1') {
    if (vertical1(char)) {
      return true;
    } 
  }    
  if (data === 'a2' || data === 'b2' || data === 'c2') {
    if (vertical2(char)) {
      return true;
    } 
  }    
  if (data === 'a3' || data === 'b3' || data === 'c3') {
    if (vertical3(char)) {
      return true;
    } 
  }    
  if (data === 'a1' || data === 'b2' || data === 'c3') {
    if (diagonal1(char)) {
      return true;
    } 
  }    
  if (data === 'a3' || data === 'b2' || data === 'c1') {
    if (diagonal2(char)) {
      return true;
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
    if(openSquares.length > 0) {
      var squareNum = getRandomNum();
      var squareId = openSquares[squareNum];
      noWinner = moveLogic(squareId, $that.char);
      if (noWinner) {
        computerAI.turnActive = false;
      }
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
  openSquares = [];
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
}
