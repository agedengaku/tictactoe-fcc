(function(){
"use strict";
screen.orientation.lock('landscape');
// HTML elements
const playButtonScreen = document.getElementById('play-button-screen');
const playButton = document.getElementById('play-button');
const titleScreen = document.getElementById("title-screen");
const titleScreenVideo = document.getElementById("title-screen-video");
const difficultySelectScreen = document.getElementById("difficulty-select-screen");
const difficultyMode = document.getElementsByClassName("difficulty-mode");
const charSelectScreen = document.getElementById("char-select-screen");
const mapImageFile = document.getElementById("map-image-file");
const playerSelect = document.getElementsByClassName("player-select");
const vsScreen = document.getElementById("vs-screen");
const vsScreenImage = document.getElementById("vs-screen-image");
const mainScreen = document.getElementById("main-screen");
const ryuStageImage = document.getElementById("ryu-stage");
const blackOut = document.getElementById("blackout");
const roundImage = document.getElementById("round-image");
const boardSquares = document.getElementsByClassName("board-square");
const player1Char = document.getElementById("player-1-char");
const player2Char = document.getElementById("player-2-char");
const player1CharImg = document.getElementById("player-1-char-img");
const player2CharImg = document.getElementById("player-2-char-img");
const endScreenImage = document.getElementById("end-screen-image");
// Music
const clickToStartAudio = new Audio("resources/audio/sfx/system/click-to-start.mp3");
const charSelectedAudio = new Audio("resources/audio/sfx/system/char-selected.mp3");
const airplaneAudio = new Audio("resources/audio/sfx/system/airplane-audio.mp3");
const vsScreenBGM = new Audio("resources/audio/bgm/vs-screen-bgm.mp3");
const endGameAudio = new Audio("resources/audio/bgm/end-game.mp3");
// Round - Win - Lose
const round1Audio = new Audio("resources/audio/round/round1.mp3");
const round2Audio = new Audio("resources/audio/round/round2.mp3");
const round3Audio = new Audio("resources/audio/round/round3.mp3");
const round4Audio = new Audio("resources/audio/round/round4.mp3");
const round5Audio = new Audio("resources/audio/round/round5.mp3");
const youWin = new Audio("resources/audio/round/you-win.mp3");
const youLose = new Audio("resources/audio/round/you-lose.mp3");
//SFX
const attackAudio = new Audio("resources/audio/sfx/character/attack-audio.mp3");
const hitAudio = new Audio("resources/audio/sfx/character/hit-audio.mp3");
const shoryukenAudio = new Audio("resources/audio/sfx/character/shoryuken-audio.mp3");
const KOscream = new Audio("resources/audio/sfx/character/KO-scream.mp3");
//WebAudio
var context, bufferLoader, stageBGMMain, mapBGMMain, bgmMain, gainNode;

let gameStarted = false;
let titleScreenOn = true;
let selectScreenOn = true;
let gameover = false;
let currentGameState = {};
let human = {};
let computerAI = {};
let openSquares = ["0", "1", "2", "3", "4", "5", "6", "7", "8"];
let selectedDifficulty;
let rounds = 0;

let lastFrameName;
let frameCount = 1;

init();

function init() {
  rounds++;
  currentGameState = new GameState();  
  if (gameStarted === false) {
    human = {};
    computerAI = {};
    selectedDifficulty = undefined;
    for(var i = 0; i < difficultyMode.length; i++) {
      difficultyMode[i].addEventListener("click", difficultyModeSelect);
      difficultyMode[i].addEventListener("mouseenter", modeHoverAudio);
    }
    for(var i = 0; i < playerSelect.length; i++) {
      playerSelect[i].addEventListener("click", charSelect);
      playerSelect[i].addEventListener("mouseenter", charHover);
    }
    gameStarted = true;
  }
  for(var i = 0; i < boardSquares.length; i++) {
    boardSquares[i].onclick = humanMove; 
  }
  human.turnActive = true;
}

function GameState() {
  this.turnsTaken = 0;
  this.boardState = ["0", "1", "2", "3", "4", "5", "6", "7", "8"];
}

playButton.addEventListener("click", playVid);
function playVid() {
  titleScreenVideo.play();
  playButton.remove();
  playButtonScreen.remove();
}

titleScreenVideo.addEventListener("click", titleScreenClicked);

function titleScreenClicked(){
  clickToStartAudio.play();
  titleScreenVideo.pause();
  setTimeout(function(){ titleScreen.remove(); }, 2500);
  titleScreenOn = false;
  titleScreenVideo.removeEventListener("click", titleScreenClicked);
}

function modeHoverAudio() {
  let sound = new Audio("resources/audio/sfx/system/mode-hover.mp3");
  sound.play();  
}

function difficultyModeSelect() {
  if(titleScreenOn === false) {
    selectedDifficulty = this.id;
    this.classList.add("selected");
    clickToStartAudio.play()
    for(var i = 0; i < difficultyMode.length; i++) {
      difficultyMode[i].removeEventListener("mouseenter", modeHoverAudio);
      difficultyMode[i].removeEventListener("click", difficultyModeSelect);
      difficultyMode[i].classList.remove("selection");
    }
    setTimeout(function(){
      difficultySelectScreen.remove();
      // charSelectScreenBGM();
      webAudioBGM('resources/audio/bgm/char-select-intro.mp3', 'resources/audio/bgm/char-select-main2.mp3', 3.9);
    }, 2500);
  }
}

function charHover() {
  let sound = new Audio("resources/audio/sfx/system/char-icon-hover.mp3");
  sound.play();  
  if (this.id === "O")
    mapImageFile.src="resources/img/screens/world-map/ryu-char-select.jpg";
  else
    mapImageFile.src="resources/img/screens/world-map/guile-char-select.jpg";
}

function charSelect() {
  charSelectedAudio.play();
  for(var i = 0; i < playerSelect.length; i++) {
    playerSelect[i].removeEventListener("mouseenter", charHover);
    playerSelect[i].removeEventListener("click", charSelect);
    playerSelect[i].classList.remove("selection");
  }
  if (selectedDifficulty && titleScreenOn === false) {
    human = new Player(this.id);
    this.classList.add("selected");
    this.classList.remove("selection");
    if (this.id === "O") { 
      computerAI = new Computer("X");
      mapImageFile.src= "resources/img/screens/world-map/ryu-selected-flag.jpg";
    } else {
      computerAI = new Computer("O");
      mapImageFile.src= "resources/img/screens/world-map/guile-selected-flag.jpg";
      vsScreenImage.src= "resources/img/screens/vs-screen/guile-vs-screen.jpg";
      ryuStageImage.src = "resources/img/screens/ryu-stage/ryu-stage-X.jpg";
      player1Char.classList.remove("ryu-idle");
      player1Char.classList.add("guile-idle");      
      player2Char.classList.remove("guile-idle");
      player2Char.classList.add("ryu-idle");
    }
    computerAI.difficulty = selectedDifficulty;
    selectScreenOn = false;
    setTimeout(function(){
      airplaneAudio.play();
      if (human.char === "O")
        mapImageFile.src="resources/img/screens/world-map/ryu-selected-animated.gif";
      else 
        mapImageFile.src="resources/img/screens/world-map/guile-selected-animated.gif";
    }, 1000);
    setTimeout(function(){
      charSelectScreen.remove();
      // mapBGMMain.stop();
      bgmMain.stop();
      vsScreenBGM.play();
    }, 4000);
    setTimeout(function(){
      vsScreen.remove();
      // stageBGM();
      webAudioBGM('resources/audio/bgm/ryu-theme-intro.ogg', 'resources/audio/bgm/ryu-theme-main.ogg', 4.27);
      roundMedia();
    },9000);
  }
}

function humanMove(){
  //computerAI.turnActive is set to false to prevent player from clicking a square before computer makes a move
  //also ensures computerAI has been instantiated and difficulty setting selected before a move can be placed
  if (computerAI.turnActive === false && computerAI.difficulty && selectScreenOn === false) {
    var noWinner;
    var squareId = this.id;
    if (openSquares.indexOf(squareId) !== -1){

      noWinner = moveLogic(squareId, human.char);
      if (noWinner && gameover === false) {

        attackHitMedia(human.char, player1Char, computerAI.char, player2Char);

          computerAI.turnActive = true;
          human.turnActive = false;
          setTimeout(computerAI.move, 2500);
      } 
    }
  } 
}

function attackHitMedia(char1, char1Element, char2, char2Element) {
  setupAndRunAnimation(char1, char1Element, true);
  attackAudio.play();
  setTimeout(function(){
    setupAndRunAnimation(char2, char2Element, false);
    hitAudio.play();
  }, 300);
}

function setupAndRunAnimation(char, playerSide, attack) {
  let frameName;
  let gifLength;
  let val = getRandomNum(3);

  if (attack) {
      //if ryu
      if (char === "O") {
        if (val == 0) {
          frameName = "ryu-punch-frame";
          gifLength = 5; 
        } else if (val == 1) {
          frameName = "ryu-punch2-frame";
          gifLength = 5; 
        } else {
          frameName = "ryu-kick-frame";
          gifLength = 5; 
        }        
      } else {
        //if guile
         if (val == 0) {
          frameName = "guile-punch-frame";
          gifLength = 5; 
        } else if (val == 1) {
          frameName = "guile-kick-frame";
          gifLength = 8; 
        } else {
          frameName = "guile-kick2-frame";
          gifLength = 5; 
        }        
      }
  } else {
    //if hit
    if (char === "O") {
      //if ryu
        frameName = "ryu-hit-frame";
        gifLength = 4;        
      } else {
        //if guile
        frameName = "guile-hit-frame";
        gifLength = 3;  
      }
  }

  if (playerSide === player1Char) {
      let player1AnimationObj = new runAnimationObject(playerSide, frameName, gifLength, attack);
      player1AnimationObj.runAnimation();
  }  

  if (playerSide === player2Char) {
      let player2AnimationObj = new runAnimationObject(playerSide, frameName, gifLength, attack);
      player2AnimationObj.runAnimation();
  }
} 

function runAnimationObject(player, frameName, gifLength, attack) {
    var $that = this;
    this.idle;
    this.player = player;
    this.frameName = frameName;
    this.gifLength = gifLength;
    this.lastFrameName;
    this.frameCount = 1;
    if (attack === true)
      this.intervalTime = 100;  
    else
      this.intervalTime = 200;

    this.runAnimation = function() {
      let intervalID = setInterval(function(){
        if ($that.player == player1Char) {
          if (human.char == "O") { $that.idle = "ryu-idle"; }
          else { $that.idle = "guile-idle"; }
        } else {
          if (computerAI.char =="O") { $that.idle = "ryu-idle"; }
          else { $that.idle = "guile-idle"; }
        }

        if ($that.player.classList.contains($that.idle)){
          $that.player.classList.remove($that.idle);
          $that.lastFrameName = $that.frameName + $that.frameCount;
          $that.player.classList.add($that.lastFrameName);
        } else if ($that.frameCount <= $that.gifLength) {
          $that.player.classList.remove($that.lastFrameName);
          $that.lastFrameName = $that.lastFrameName.slice(0, -1) + $that.frameCount;
          $that.player.classList.add($that.lastFrameName);
          $that.frameCount++;
        } else {
          $that.player.classList.remove($that.lastFrameName);
          $that.player.classList.add($that.idle);
          $that.frameCount = 1;
          clearInterval(intervalID);
        }
      }, $that.intervalTime);
  }  
}

function moveLogic(squareId, char){
  var charImg = document.createElement("img");
  charImg.classList.add("char-css");
  if (char === "O")
    charImg.src = "resources/img/screens/ryu-stage/O.gif";
  else
    charImg.src = "resources/img/screens/ryu-stage/X.gif";
  var result;
  removeFromOpen(squareId);
  currentGameState.boardState[squareId] = char;
  document.getElementById(squareId).appendChild(charImg);
  currentGameState.turnsTaken++;

if (currentGameState.turnsTaken > 4) {
    result = checkForWinner(char);
    if (result) {
        if(rounds !== 5) {
          //run win and ko animations
          roundWinAnimation(char);
          //prevents human move
          computerAI.turnActive = true;
          //reset rounds
          setTimeout(function(){ reset(); }, 10000);
          return false;
        } else {
          gameover = true;
          setTimeout(function(){ endGame(human.wins, computerAI.wins); });
        }
    } else {
      if (currentGameState.turnsTaken === 9) {
        let char1, char2, elementAttack, elementHit;
        if (char === human.char) {
          elementAttack = player1Char;
          elementHit = player2Char;
        } else {
          elementAttack = player2Char;
          elementHit = player1Char;
        }
        if (char === "O") {
          char1 = "O"; 
          char2 = "X"; 
        } else { 
          char1 = "X";
          char2 = "O";
        }
        attackHitMedia(char1, elementAttack, char2, elementHit);
        drawImage();

        if (rounds !== 5) {
          //prevents human move
          computerAI.turnActive = true;
          setTimeout(function(){ reset(); }, 6000);
          return false;
        } else {
          gameover = true;
          endGame(human.wins, computerAI.wins);
        }
      }  else {
        return true;
      }
    }
  }
  if (result !== true) { return true; }
}

function drawImage() {
  gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 4);
  if (human.char === "O")  {
    setTimeout(function(){              
      player1Char.classList.remove("ryu-idle");
      player2Char.classList.remove("guile-idle");
      player1CharImg.src = "resources/img/animated/ryu/ryu-draw.gif";
      player2CharImg.src ="resources/img/animated/guile/guile-draw.gif"; 
    },3000);      
  } else {
    setTimeout(function(){              
      player1Char.classList.remove("guile-idle");
      player2Char.classList.remove("ryu-idle");
      player1CharImg.src = "resources/img/animated/guile/guile-draw.gif";
      player2CharImg.src = "resources/img/animated/ryu/ryu-draw.gif"; 
    },3000);     
  }
  setTimeout(function(){ roundImage.src = "resources/img/animated/round/draw.gif"; },3500);
}

function checkForWinner(char) {
    if (winCombination(currentGameState.boardState, char)) {
      let result = winScore(char);
      return result;
    } else {
      return false;
    }
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

function winScore(char) {
  if (char === human.char){    
    human.wins++;
    if (char == "O") {
      if (human.wins == 1 && computerAI.wins == 0) { ryuStageImage.src = "resources/img/screens/ryu-stage/ryu-stage-O-1win-0win.jpg"; } 
      else if (human.wins == 1 && computerAI.wins == 1) { ryuStageImage.src = "resources/img/screens/ryu-stage/ryu-stage-O-1win-1win.jpg"; } 
      else if (human.wins == 2 && computerAI.wins == 0) {
        ryuStageImage.src = "resources/img/screens/ryu-stage/ryu-stage-O-2win-0win.jpg";
        gameover = true;
        endGame(human.char);
      } 
      else if (human.wins == 2 && computerAI.wins == 1) {
        ryuStageImage.src = "resources/img/screens/ryu-stage/ryu-stage-O-2win-1win.jpg";    
        gameover = true;      
        endGame(human.char);
      }
    } else {
      if (human.wins == 1 && computerAI.wins == 0) { ryuStageImage.src = "resources/img/screens/ryu-stage/ryu-stage-X-1win-0win.jpg"; } 
      else if (human.wins == 1 && computerAI.wins == 1) { ryuStageImage.src = "resources/img/screens/ryu-stage/ryu-stage-X-1win-1win.jpg"; } 
      else if (human.wins == 2 && computerAI.wins == 0) {
        ryuStageImage.src = "resources/img/screens/ryu-stage/ryu-stage-X-2win-0win.jpg";
        gameover = true;
        endGame(human.char);
      } 
      else if (human.wins == 2 && computerAI.wins == 1) {
        ryuStageImage.src = "resources/img/screens/ryu-stage/ryu-stage-X-2win-1win.jpg";     
        gameover = true;
        endGame(human.char);
      }  
    }
  } else {
    computerAI.wins++;
    if (char == "X") {
      if (human.wins == 0 && computerAI.wins == 1) { ryuStageImage.src = "resources/img/screens/ryu-stage/ryu-stage-O-0win-1win.jpg"; } 
      else if (human.wins == 1 && computerAI.wins == 1) { ryuStageImage.src = "resources/img/screens/ryu-stage/ryu-stage-O-1win-1win.jpg"; } 
      else if (human.wins == 0 && computerAI.wins == 2) {
        ryuStageImage.src = "resources/img/screens/ryu-stage/ryu-stage-O-0win-2win.jpg";
        gameover = true;        
        endGame(computerAI.char);
      } else if (human.wins == 1 && computerAI.wins == 2) {
         ryuStageImage.src = "resources/img/screens/ryu-stage/ryu-stage-O-1win-2win.jpg";     
         gameover = true;
         endGame(computerAI.char);
      }
    } else {
      if (human.wins == 0 && computerAI.wins == 1) { ryuStageImage.src = "resources/img/screens/ryu-stage/ryu-stage-X-0win-1win.jpg"; } 
      else if (human.wins == 1 && computerAI.wins == 1) { ryuStageImage.src = "resources/img/screens/ryu-stage/ryu-stage-X-1win-1win.jpg"; } 
      else if (human.wins == 0 && computerAI.wins == 2) {
        ryuStageImage.src = "resources/img/screens/ryu-stage/ryu-stage-X-0win-2win.jpg";
        gameover = true;
        endGame(computerAI.char);
      } else if (human.wins == 1 && computerAI.wins == 2) {
         ryuStageImage.src = "resources/img/screens/ryu-stage/ryu-stage-X-1win-2win.jpg";     
         gameover = true;
         endGame(computerAI.char);
      }      
    }
  }
  return true;
} 

function roundWinAnimation(char) {

  let player, playerImg, opponent, opponentImg, idleGif, winAttackGif, winAttackAudio, opponentIdleGif, KOgif, guileWinStance, KOinterval, youWinLose, youWinLoseAudio;

  if (char === "O") {
    idleGif = "ryu-idle";
    winAttackGif = "resources/img/animated/ryu/ryu-shoryuken.gif"
    winAttackAudio = shoryukenAudio;
    opponentIdleGif = "guile-idle";
    KOgif = "resources/img/animated/guile/guile-KO.gif";
  } else {
      idleGif = "guile-idle";
      winAttackGif = "resources/img/animated/guile/guile-flash-kick.gif";
      opponentIdleGif = "ryu-idle";
      winAttackAudio = attackAudio;
      KOgif = "resources/img/animated/ryu/ryu-KO.gif";
      guileWinStance = "resources/img/animated/guile/guile-win.gif";
  }
  if (human.char === char) { 
      player = player1Char;
      playerImg = player1CharImg;
      opponent = player2Char;
      opponentImg = player2CharImg;
      youWinLose = "resources/img/animated/round/you-win.gif";      
      youWinLoseAudio = youWin;      
  } else {
    player = player2Char;
    playerImg = player2CharImg;
    opponent = player1Char;
    opponentImg = player1CharImg;
    youWinLose = "resources/img/animated/round/you-lose.gif";   
    youWinLoseAudio = youLose;      
  }
  //win attack
  player.classList.remove(idleGif);
  playerImg.src = winAttackGif;
  winAttackAudio.play();
  //winnning stance for ryu
  if (idleGif === "ryu-idle") {
    KOinterval = 300;
   setTimeout(function(){
      playerImg.src = "resources/img/animated/ryu/ryu-win1.gif";
      gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 4);
      setTimeout(function(){ playerImg.src = "resources/img/animated/ryu/ryu-win2.gif"; },200);
    },3800); 
  //winning stance for guile
  } else {
    KOinterval = 400;
    setTimeout(function(){ 
      playerImg.src = guileWinStance; 
      gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 4);
    },3800); 
  }
  //opponent KO
  setTimeout(function(){
    opponent.classList.remove(opponentIdleGif);
    opponentImg.src = KOgif;
    hitAudio.play();
    setTimeout(function(){ KOscream.play(); },1000);
    setTimeout(function(){ playFallAudio(); },1500);    
    setTimeout(function(){ playFallAudio(); },2300);
  }, KOinterval);   
  setTimeout(function(){ 
    roundImage.src = youWinLose;
    youWinLoseAudio.play();
  },3800);   

  function playFallAudio() {
    let sound = new Audio("resources/audio/sfx/character/fall-audio.mp3");
    sound.play();
  }
}

function Player(char) {
  this.char = char;
  this.wins = 0;
  this.turnActive = false;
}

function Computer(char) {
  Player.call(this, char); 
  this.difficulty;
  this.turnActive = true;
  this.move = () => {
    if (this.difficulty === "easy") { this.easyAI(); } 
    else if (this.difficulty === "normal") { this.normalAI(); } 
    else { this.hardAI(); }
  }
  this.easyAI = () => {
    var noWinner;
    //select random num from 0 to 8 incluside (dependent on number of squares)
    if(openSquares.length !== 0) {
      var squareNum = getRandomNum(openSquares.length);
      var squareId = openSquares[squareNum];
      noWinner = moveLogic(squareId, this.char);
      if (noWinner) {
        attackHitMedia(this.char, player2Char, human.char, player1Char);
        setTimeout(function(){ computerAI.turnActive = false; },1600);
      }
    }
  }
  //normal mode selects randomly selects easy or hard mode on each move
  this.normalAI = () => {
    var modeSelector = getRandomNum(2);
    if (modeSelector === 0) {
      this.easyAI();
      console.log("easy");
    } else {
      this.hardAI();
      console.log("hard");
    }
  }
  //hard mode uses minimax function to ensure human never wins
  this.hardAI = () => {
    var noWinner;
    var result = minimax(currentGameState.boardState, computerAI.char).index;
    var squareId = currentGameState.boardState[result];
    noWinner = moveLogic(squareId, this.char);
    if (noWinner) {
        attackHitMedia(this.char, player2Char, human.char, player1Char);
        setTimeout(function(){ computerAI.turnActive = false; },1600);
    }
  }
}
//minimax function taken from https://medium.freecodecamp.org/how-to-make-your-tic-tac-toe-game-unbeatable-by-using-the-minimax-algorithm-9d690bad4b37
//and https://codepen.io/abdolsa/pen/vgjoMb
function minimax(reboard, player) {
  var array = availableSquares(reboard);
  if (winCombination(reboard, human.char)) {
    return { score: -10 };
  } else if (winCombination(reboard, computerAI.char)) {
    return { score: 10 };
  } else if (array.length === 0) {
    return { score: 0 };
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

function roundMedia() {
  setTimeout(function(){
    switch(rounds) {
        case 1: 
          roundImage.src = "resources/img/animated/round/round1.gif";
          round1Audio.play();
          break;
        case 2: 
          roundImage.src = "resources/img/animated/round/round2.gif";
          round2Audio.play();
          break;        
        case 3: 
          roundImage.src = "resources/img/animated/round/round3.gif";
          round3Audio.play();
          break;        
        case 4: 
          roundImage.src = "resources/img/animated/round/round4.gif";
          round4Audio.play();
          break;        
        case 5: 
          roundImage.src = "resources/img/animated/round/round5.gif";
          round5Audio.play();
          break;
    }
    setTimeout(function(){
      computerAI.turnActive = false;
      roundImage.src = "";
    }, 3000);
  }, 1000);
}

function reset() {
  if (!gameover) {
    blackOut.classList.add("fade-in-and-out");
    // stageBGMMain.stop();
    bgmMain.stop();
    setTimeout(function(){
        player1CharImg.src = "";
        player2CharImg.src = "";
        roundImage.src = "";
        if (human.char === "O") {
          player1Char.classList.add("ryu-idle", "ryu-1p");
          player2Char.classList.add("guile-idle", "guile-2p");
        } else {
          player2Char.classList.add("ryu-idle", "ryu-1p");
          player1Char.classList.add("guile-idle", "guile-2p");
        }
      },1000);
    setTimeout(function(){ blackOut.classList.remove("fade-in-and-out"); },2000);
    for(var i = 0; i < boardSquares.length; i++) { boardSquares[i].innerHTML = ''; }
    currentGameState = {};
    human.turnActive = false;
    openSquares = ["0", "1", "2", "3", "4", "5", "6", "7", "8"];
    init();
    setTimeout(function(){ 
      // stageBGM();
      webAudioBGM('resources/audio/bgm/ryu-theme-intro.ogg', 'resources/audio/bgm/ryu-theme-main.ogg', 4.27);
      roundMedia(); 
    },1000)
  }
}

function endGame(val, val2) {
  setTimeout(function(){ setEndScreen(val, val2); },8000);
  function setEndScreen(val, val2) {
    if (val2 !== undefined) {
      if (val > val2) {
        if (human.char === "O")
          endScreenImage.src = "resources/img/screens/end-game/ryu-win-guile-lose.jpg";
        else
          endScreenImage.src = "resources/img/screens/end-game/guile-win-ryu-lose.jpg";
      } else if (val < val2) {
        if (computerAI.char === "O")
          endScreenImage.src = "resources/img/screens/end-game/guile-lose-ryu-win.jpg";
        else
          endScreenImage.src = "resources/img/screens/end-game/ryu-lose-guile-win.jpg";
      } else {
        var num = getRandomNum(10);
        if(human.char ==="O") {
          if (num < 7) { endScreenImage.src = "resources/img/screens/end-game/ryu-lose-guile-lose.jpg"; }
          else if (num === 7) { endScreenImage.src = "resources/img/screens/end-game/ryu-lose-guile-lose-1.jpg"; }
          else if (num === 8) { endScreenImage.src = "resources/img/screens/end-game/ryu-lose-guile-lose-2.jpg"; }
          else { endScreenImage.src = "resources/img/screens/end-game/ryu-lose-guile-lose-3.jpg"; }
        }
        else {
          if (num < 7) { endScreenImage.src = "resources/img/screens/end-game/guile-lose-ryu-lose.jpg"; }
          else if (num === 7) { endScreenImage.src = "resources/img/screens/end-game/guile-lose-ryu-lose-1.jpg"; }
          else if (num === 8) { endScreenImage.src = "resources/img/screens/end-game/guile-lose-ryu-lose-2.jpg"; }
          else { endScreenImage.src = "resources/img/screens/end-game/guile-lose-ryu-lose-3.jpg"; }
        }
      }
    } else {
      if (val == human.char) {
        if (val == "X") { endScreenImage.src ="resources/img/screens/end-game/guile-win-ryu-lose.jpg"; }
      } else {
        if (val == "O") { endScreenImage.src ="resources/img/screens/end-game/guile-lose-ryu-win.jpg"; } 
        else { endScreenImage.src ="resources/img/screens/end-game/ryu-lose-guile-win.jpg"; }
      }
    }
    setTimeout(function(){
      mainScreen.remove();
      endGameAudio.play();
    },500);
  }
  setTimeout(function(){ window.location.reload(); }, 16000);
}

//WebAudio functions
function webAudioBGM(clip1, clip2, time) {
  // Taken https://www.html5rocks.com/en/tutorials/webaudio/intro/
  window.onload = initBGM();

  function initBGM() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();

    bufferLoader = new BufferLoader(
      context,
      [
        clip1,
        clip2,
      ],
      finishedLoading
      );
    bufferLoader.load();
  }

  function finishedLoading(bufferList) {
    var bgmIntro = context.createBufferSource();
    bgmMain = context.createBufferSource();

    bgmIntro.buffer = bufferList[0];
    bgmMain.buffer = bufferList[1];

    gainNode = context.createGain();
    gainNode.gain.setValueAtTime(1, context.currentTime);
  
    bgmMain.connect(gainNode);

    bgmIntro.connect(context.destination);
    gainNode.connect(context.destination);

    bgmIntro.start(0);
    bgmMain.start(time);
    bgmMain.loop = true; 
  }
}
// Taken from https://stackoverflow.com/questions/17333777/uncaught-reference-error-bufferloader-is-not-defined
function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}
BufferLoader.prototype.loadBuffer = function(url, index) {
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
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

})();