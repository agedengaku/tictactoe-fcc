"use strict";

const playerSelect = document.getElementsByClassName("player-select");
const boardSquares = document.getElementsByClassName("board-square");

const difficultyMode = document.getElementsByClassName("difficulty-mode");
const difficultySelectScreen = document.getElementById("difficulty-select-screen");
const titleScreen = document.getElementById("title-screen");
const titleScreenVideo = document.getElementById("title-screen-video");
const selectScreen = document.getElementById("select-screen");

const charSelectBgm = document.getElementById("char-select-bgm");
const charSelectIntro = document.getElementById("char-select-intro");
const charSelectMain = document.getElementById("char-select-main");

const xScore = document.getElementById("x-score");
const oScore = document.getElementById("o-score");
// const resetBtn = document.getElementById("reset");
const playButton = document.getElementById('play-button');
const playButtonScreen = document.getElementById('play-button-screen');
const vid = document.getElementById('title-screen-video');
// const clickToStart = document.getElementById('click-to-start');

let computerTurnId;
let gameStarted = false;
let currentGameState = {};
let human = {};
let computerAI = {};
let openSquares = ["0", "1", "2", "3", "4", "5", "6", "7", "8"];
let selectedDifficulty;
let titleScreenOn = true;
let selectScreenOn = true;

let clickToStart = new Audio("ClickToStart-edited.mp3");

init();
// resetBtn.onclick = reset;

playButton.addEventListener("click", playVid);
function playVid() {
  vid.play();
  playButton.remove();
  playButtonScreen.remove();
}

function titleScreenClicked(){
  clickToStart.play();
  vid.pause();
  setTimeout(function(){
    removeScreen(titleScreen);
  }, 2500);
  titleScreenOn = false;
  titleScreenVideo.removeEventListener("click", titleScreenClicked);
}
  titleScreenVideo.addEventListener("click", titleScreenClicked);
  function modeSelectAudio() {
    let sound = new Audio("mode-select.mp3");
    sound.play();  
  }

function removeScreen(element) {
  element.remove();
}


function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

// https://stackoverflow.com/questions/17333777/uncaught-reference-error-bufferloader-is-not-defined
BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
}





function charSelectScreen() {

// window.onload = initSound;
initSound();
var context;
var bufferLoader;

function initSound() {
  // Fix up prefixing
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();
  bufferLoader = new BufferLoader(
    context,
    [
      'char-select-intro.mp3',
      'char-select-main-2.mp3',
    ],
    finishedLoading
    );
  bufferLoader.load();
}

function finishedLoading(bufferList) {
  // Create two sources and play them both together.
  var source1 = context.createBufferSource();
  var source2 = context.createBufferSource();
  source1.buffer = bufferList[0];
  source2.buffer = bufferList[1];

  source1.connect(context.destination);
  source2.connect(context.destination);

  source1.start(0);
  source2.start(3.8);
  source2.loop = true;  
  
}




// https://stackoverflow.com/questions/29882907/how-to-seamlessly-loop-sound-with-web-audio-api
//this is the webaudio loooooppppppp
    //enter url in the next line
    // var url  = 'CharSelectMain.mp3';

    // /* --- set up web audio --- */
    // //create the context
    // window.AudioContext = window.AudioContext || window.webkitAudioContext;
    // var context = new AudioContext();
    // //...and the source
    // var source = context.createBufferSource();
    // //connect it to the destination so you can hear it.
    // source.connect(context.destination);

    // /* --- load buffer ---  */
    // var request = new XMLHttpRequest();
    // //open the request
    // request.open('GET', url, true); 
    // //webaudio paramaters
    // request.responseType = 'arraybuffer';
    // //Once the request has completed... do this
    // request.onload = function() {
    //     context.decodeAudioData(request.response, function(response) {
    //         /* --- play the sound AFTER the buffer loaded --- */
    //         //set the buffer to the response we just received.
    //         source.buffer = response;
    //         //start(0) should play asap.
    //         source.start(0);
    //         source.loop = true;
    //     }, function () { console.error('The request failed.'); } );
    // }
    // //Now that the request has been defined, actually make the request. (send it)
    // request.send();


  // charSelectIntro.play();
  charSelectIntro.addEventListener("ended", function(){
    // charSelectMain.play();
  });
}

function init() {
  currentGameState = new GameState();  
  if (gameStarted === false) {
    human = {};
    computerAI = {};
    selectedDifficulty = undefined;
    for(var i = 0; i < difficultyMode.length; i++) {
      difficultyMode[i].addEventListener("click", difficultyModeSelect);
      difficultyMode[i].addEventListener("mouseenter", modeSelectAudio);
    }
    for(var i = 0; i < playerSelect.length; i++) {
      playerSelect[i].addEventListener("click", charSelect);
    }
    // xScore.innerHTML = '';
    // oScore.innerHTML = '';
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
  if (computerAI.turnActive === false && computerAI.difficulty && selectScreenOn === false) {
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
    if ($that.difficulty === "easy") {
      $that.easyAI();
    } else if ($that.difficulty === "normal") {
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
  // this.hardAI = function(){
  this.hardAI = () => {
    var noWinner;
    var result = minimax(currentGameState.boardState, computerAI.char).index;
    var squareId = currentGameState.boardState[result];
    // noWinner = moveLogic(squareId, $that.char);
    noWinner = moveLogic(squareId, this.char);
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
    document.body.insertBefore(selectScreen, document.body.childNodes[0]);
    document.body.insertBefore(titleScreen, document.body.childNodes[0]);
  }
  openSquares = ["0", "1", "2", "3", "4", "5", "6", "7", "8"];
  init();
}

function charSelect() {
  if (selectedDifficulty && titleScreenOn === false) {
    human = new Player(this.id);
    if (this.id === "O") { 
      computerAI = new Computer("X");
    } else {
      computerAI = new Computer("O");
    }
    computerAI.difficulty = selectedDifficulty;
    for(var i = 0; i < playerSelect.length; i++) {
      playerSelect[i].removeEventListener("click", charSelect);
    }
    selectScreenOn = false;
    selectScreen.remove();
  }
}

function difficultyModeSelect() {
  if(titleScreenOn === false) {
    selectedDifficulty = this.id;
    clickToStart.play()
    for(var i = 0; i < difficultyMode.length; i++) {
      difficultyMode[i].removeEventListener("mouseenter", modeSelectAudio);
      difficultyMode[i].removeEventListener("click", difficultyModeSelect);
    }
    setTimeout(function(){
      removeScreen(difficultySelectScreen);
      charSelectScreen();
    }, 2500);
  }
}
