"use strict";

const playerSelect = document.getElementsByClassName("player-select");
const boardSquares = document.getElementsByClassName("board-square");

const difficultyMode = document.getElementsByClassName("difficulty-mode");
const difficultySelectScreen = document.getElementById("difficulty-select-screen");
const titleScreen = document.getElementById("title-screen");
const titleScreenVideo = document.getElementById("title-screen-video");
const charSelectScreen = document.getElementById("char-select-screen");
const mapImageFile = document.getElementById("map-image-file");
const vsScreen = document.getElementById("vs-screen");
const vsScreenImage = document.getElementById("vs-screen-image");
const ryuStageImage = document.getElementById("ryu-stage");
const endScreenImage = document.getElementById("end-screen-image");
const roundImage = document.getElementById("round-image");
const blackOut = document.getElementById("blackout");
const player1Char = document.getElementById("player-1-char");
const player2Char = document.getElementById("player-2-char");
const player1CharImg = document.getElementById("player-1-char-img");
const player2CharImg = document.getElementById("player-2-char-img");

const clickToStartAudio = new Audio("click-to-start.mp3");
const charSelectedAudio = new Audio("char-selected.mp3");
const vsScreenBGM = new Audio("vs-screen-bgm.mp3");
const airplaneAudio = new Audio("airplane-audio.mp3");
var audioMain = null;

const round1Audio = new Audio("round1.mp3");
const round2Audio = new Audio("round2.mp3");
const round3Audio = new Audio("round3.mp3");
const round4Audio = new Audio("round4.mp3");
const round5Audio = new Audio("round5.mp3");

// const xScore = document.getElementById("x-score");
// const oScore = document.getElementById("o-score");
// const resetBtn = document.getElementById("reset");
const playButton = document.getElementById('play-button');
const playButtonScreen = document.getElementById('play-button-screen');
const vid = document.getElementById('title-screen-video');
// const clickToStart = document.getElementById('click-to-start');

let gameStarted = false;
let currentGameState = {};
let human = {};
let computerAI = {};
let openSquares = ["0", "1", "2", "3", "4", "5", "6", "7", "8"];
let selectedDifficulty;
let titleScreenOn = true;
let selectScreenOn = true;
let gameover = false;
let rounds = 0;

let lastFrameName;
let frameCount = 1;

init();
// resetBtn.onclick = reset;
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

playButton.addEventListener("click", playVid);
function playVid() {
  vid.play();
  playButton.remove();
  playButtonScreen.remove();
}

titleScreenVideo.addEventListener("click", titleScreenClicked);

function titleScreenClicked(){
  clickToStartAudio.play();
  vid.pause();
  setTimeout(function(){
    titleScreen.remove();
  }, 2500);
  titleScreenOn = false;
  titleScreenVideo.removeEventListener("click", titleScreenClicked);
}

function modeHoverAudio() {
  let sound = new Audio("mode-hover.mp3");
  sound.play();  
}
function charHover() {
  let sound = new Audio("char-icon-hover.mp3");
  sound.play();  
  if (this.id === "O") {
    mapImageFile.src="ryu-char-select.jpg";
  } else {
    mapImageFile.src="guile-char-select.jpg";
  }
}

function removeScreen(element) {
  element.remove();
}

function charSelectScreenBGM() {
  // https://www.html5rocks.com/en/tutorials/webaudio/intro/
  // window.onload = initSound;
  window.onload = initCharSelectBGM();
  var context;
  var bufferLoader;

  function initCharSelectBGM() {
    // Fix up prefixing
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();
    bufferLoader = new BufferLoader(
      context,
      [
        'char-select-intro.mp3',
        'char-select-main2.mp3',
      ],
      finishedLoading
      );
    bufferLoader.load();
  }

  function finishedLoading(bufferList) {
    // Create two sources and play them both together.
    var source1 = context.createBufferSource();
    audioMain = context.createBufferSource();
    source1.buffer = bufferList[0];
    audioMain.buffer = bufferList[1];

    source1.connect(context.destination);
    audioMain.connect(context.destination);

    source1.start(0);
    audioMain.start(3.9);
    audioMain.loop = true;  
  }

    // //this is the webaudio loooooppppppp
    // //enter url in the next line
    // var url  = 'char-select-main2.mp3';
    // /* --- set up web audio --- */
    // //create the context
    // var context = new AudioContext();
    // //...and the source
    // audioMain = context.createBufferSource();
    // //connect it to the destination so you can hear it.
    // audioMain.connect(context.destination);

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
    //         audioMain.buffer = response;
    //         //start(0) should play asap.
    //         audioMain.start(0);
    //         audioMain.loop = true;
    //     }, function () { console.error('The request failed.'); } );
    // }
    // //Now that the request has been defined, actually make the request. (send it)
    // request.send();
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
          ////// Attack animation
          //Human Attack
          setupAndRunAnimation(player1Char, true);
          // setupAndRunAnimation(player1Char, true);
          //Computer Hit
          setTimeout(function(){
            setupAndRunAnimation(player2Char, false);
          }, 300);
          //////
          computerAI.turnActive = true;
          human.turnActive = false;
          setTimeout(computerAI.move, 3000);
      } 
    }
  } else {
    console.log("Something is wrong");
    console.log("turnActive: "+computerAI.turnActive+" difficulty: "+computerAI.difficulty);
  }
}

function setupAndRunAnimation(player, attack) {
  let frameName;
  let gifLength;
  let val = getRandomNum(3);

  if (attack) {
    //if 1p
    if (player === player1Char) {
      //If human is Ryu
      if (human.char === "O") {
        if (val == 0) {
          frameName = "ryu-punch-1p";
          gifLength = 5; 
        } else if (val == 1) {
          frameName = "ryu-punch2-1p";
          gifLength = 5; 
        } else {
          frameName = "ryu-kick-1p";
          gifLength = 5; 
        }        
      } else {
        //if human is Guile
         if (val == 0) {
          frameName = "guile-punch-1p";
          gifLength = 5; 
        } else if (val == 1) {
          frameName = "guile-kick-1p";
          gifLength = 8; 
        } else {
          frameName = "guile-kick2-1p";
          gifLength = 5; 
        }        
      }

    } else {
      if (computerAI.char === "O") {
        if (val == 0) {
          frameName = "ryu-punch-2p";
          gifLength = 5; 
        } else if (val == 1) {
          frameName = "ryu-punch2-2p";
          gifLength = 5; 
        } else {
          frameName = "ryu-kick-2p";
          gifLength = 5; 
        }        
      } else {
        //if human is Guile
         if (val == 0) {
          frameName = "guile-punch-2p";
          gifLength = 5; 
        } else if (val == 1) {
          frameName = "guile-kick-2p";
          gifLength = 8; 
        } else {
          frameName = "guile-kick2-2p";
          gifLength = 5; 
        }        
      }





      //if 2p
    } 
  } else {
    //if hit
    if (player === player1Char) {
      //human is ryu
      if (human.char === "O") {
        frameName = "ryu-hit-1p";
        gifLength = 4;        
      } else {
        //if human is guile
        frameName = "guile-hit-1p";
        gifLength = 3;  
      }
    } else {
      //if computer is ryu
      if (computerAI.char === "O") {
        frameName = "ryu-hit-2p";
        gifLength = 4;
      } else {
        //if computer is guile
        frameName = "guile-hit-2p";
        gifLength = 3;
      }
    }
  }

  if (player === player1Char) {

      let player1AnimationObj = new runAnimationObject(player, frameName, gifLength, attack);
      player1AnimationObj.runAnimation();

  }  

  if (player === player2Char) {

      let player2AnimationObj = new runAnimationObject(player, frameName, gifLength, attack);
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
    if (attack === true) {
      this.intervalTime = 100;  
    } else {
      this.intervalTime = 200;
    }
    

    // this.intervalID = intervalID;

    this.runAnimation = function() {

      let intervalID = setInterval(function(){
        if ($that.player == player1Char) {
          if (human.char == "O") { $that.idle = "ryu-idle-1p"; }
          else { $that.idle = "guile-idle-1p"; }
        } else {
          if (computerAI.char =="O") { $that.idle = "ryu-idle-2p"; }
          else { $that.idle = "guile-idle-2p"; }
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

// function runAnimation(player, frameName, gifLength, intervalID) {

//     let idle;
//     let lastFrameName;

//     if (player == player1Char) {
//       if (human.char == "O") { idle = "ryu-idle-1p"; }
//       else { idle = "guile-idle-1p"; }
//     } else {
//       if (computerAI.char =="O") { idle = "ryu-idle-2p"; }
//       else { idle = "guile-idle-2p"; }
//     }
//     // console.log(idle);
    
//     if (player.classList.contains(idle)){

//       player.classList.remove(idle);
//       lastFrameName = frameName + frameCount;
//       player.classList.add(lastFrameName);

//     } else if (frameCount <= gifLength) {

//       player.classList.remove(lastFrameName);
//       lastFrameName = lastFrameName.slice(0, -1) + frameCount;
//       player.classList.add(lastFrameName);
//       frameCount++;

//     } else {

//       player.classList.remove(lastFrameName);
//       player.classList.add(idle);
//       frameCount = 1;
//       clearInterval(intervalID);
      
//     }

// }






function moveLogic(squareId, char){
  var charImg = document.createElement("img");
  charImg.classList.add("char-css");
  if (char === "O") {
    charImg.src = "O.gif";
  } else {
    charImg.src = "X.gif";
  }
  var result;
  removeFromOpen(squareId);
  currentGameState.boardState[squareId] = char;
  // document.getElementById(squareId).innerHTML = char;
  document.getElementById(squareId).appendChild(charImg);
  currentGameState.turnsTaken++;

if (currentGameState.turnsTaken > 4) {
    result = checkForWinner(char);
    if (result) {

        if(rounds !== 5) {

          roundWinAnimation(char);

          //prevents human move
          computerAI.turnActive = true;
          //finishing move
          // player1Char.classList.remove("ryu-idle-1p");
          // player1CharImg.src = "ryu-shoryuken-1p.gif";
          // //winnning stance
          // setTimeout(function(){
          //   player1CharImg.src = "ryu-win1-1p.gif";
          //   setTimeout(function(){
          //     player1CharImg.src = "ryu-win2-1p.gif";
          //   },200);
          // },3800);
          // //opponent KO
          // setTimeout(function(){
          //   player2Char.classList.remove("guile-idle-2p");
          //   player2CharImg.src = "guile-KO-2p.gif";
          // },300);
          //reset rounds
          setTimeout(function(){
            reset("round");
          }, 10000);
          return false;
        } else {
          console.log("Rounds is 5 someone won last round");
          gameover = true;
          endGame(human.wins, computerAI.wins);
        }

    } else {
      if (currentGameState.turnsTaken === 9) {
        if (rounds !== 5) {
          console.log("Draw");
          if (char === human.char) {
            setupAndRunAnimation(player1Char, true);
            setTimeout(function(){
              setupAndRunAnimation(player2Char, false);
            }, 300);
          } else {
            setupAndRunAnimation(player2Char, true);
            setTimeout(function(){
              setupAndRunAnimation(player1Char, false);
            }, 300);
          }
            
          //prevents human move
          computerAI.turnActive = true;
          setTimeout(function(){
            reset("round")
          }, 5000);
          return false;
        } else {
          console.log("Rounds is 5 no one won last round");
          gameover = true;
          endGame(human.wins, computerAI.wins);
        }
      }  else {
        return true;
      }
    }
  }
  if (result !== true) {
    return true;  
  }
}

function roundWinAnimation(char) {

  let player, playerImg, opponent, opponentImg, idleGif, winAttackGif, opponentIdleGif, KOgif, guileWinStance, KOinterval;

  if (human.char === char) {
      
      player = player1Char;
      playerImg = player1CharImg;
      opponent = player2Char;
      opponentImg = player2CharImg;

    if (char === "O") {

      idleGif = "ryu-idle-1p";
      winAttackGif = "ryu-shoryuken-1p.gif"
      opponentIdleGif = "guile-idle-2p";
      KOgif = "guile-KO-2p.gif";

    } else {

    }
  } else {

    player = player2Char;
    playerImg = player2CharImg;
    opponent = player1Char;
    opponentImg = player1CharImg;

    if (char === "O") {

      idleGif = "ryu-idle-2p";
      winAttackGif = "ryu-shoryuken-2p.gif"
      opponentIdleGif = "guile-idle-1p";
      KOgif = "guile-KO-1p.gif";

    } else {

      idleGif = "guile-idle-2p";
      winAttackGif = "guile-flash-kick-2p.gif";
      opponentIdleGif = "ryu-idle-1p";
      KOgif = "ryu-KO-1p.gif";
      guileWinStance = "guile-win-2p.gif";

      // player2Char.classList.remove("guile-idle-1p");
      // player2CharImg.src = "guile-flash-kick-1p.gif";
      // //winnning stance
      // setTimeout(function(){
      //   player2CharImg.src = "guile-win1-1p.gif";
      //   setTimeout(function(){
      //     player2CharImg.src = "guile-win2-1p.gif";
      //   },200);
      // },3800);
      // //opponent KO
      // setTimeout(function(){
      //   player1Char.classList.remove("ryu-idle-2p");
      //   player1CharImg.src = "ryu-KO-2p.gif";
      // },300);  
    }
  }

  //win attack
  player.classList.remove(idleGif);
  playerImg.src = winAttackGif;

  //winnning stance for ryu
  if (idleGif === "ryu-idle-1p" || idleGif === "ryu-idle-2p") {
    KOinterval = 400;
   setTimeout(function(){
      playerImg.src = "ryu-win1-1p.gif";
      setTimeout(function(){
        playerImg.src = "ryu-win2-1p.gif";
      },200);
    },3800); 
  //winning stance for guile
  } else {
    KOinterval = 800;
    setTimeout(function(){ playerImg.src = guileWinStance; },3800); 
  }
  //opponent KO
  setTimeout(function(){
    opponent.classList.remove(opponentIdleGif);
    opponentImg.src = KOgif;
  }, KOinterval);      

}

      // player1Char.classList.remove("ryu-idle-1p");
      // player1CharImg.src = "ryu-shoryuken-1p.gif";
      // //winnning stance
      // setTimeout(function(){
      //   player1CharImg.src = "ryu-win1-1p.gif";
      //   setTimeout(function(){
      //     player1CharImg.src = "ryu-win2-1p.gif";
      //   },200);
      // },3800);
      // //opponent KO
      // setTimeout(function(){
      //   player2Char.classList.remove("guile-idle-2p");
      //   player2CharImg.src = "guile-KO-2p.gif";
      // },300);      

function checkForWinner(char) {
    if (winCombination(currentGameState.boardState, char)) {
      let result = winScore(char);
      return result;
    } else {
      return false;
    }
}    

function winScore(char) {
  if (char === human.char){
    setTimeout(function(){
      console.log(char + " Human wins!");
    }, 1000);
    
    human.wins++;
    console.log(human.wins);
    // human.scoreHolder.innerHTML = human.wins;
    if (char == "O") {
      if (human.wins == 1 && computerAI.wins == 0) { ryuStageImage.src = "ryu-stage-O-1win-0win.jpg"; } 
      else if (human.wins == 1 && computerAI.wins == 1) { ryuStageImage.src = "ryu-stage-O-1win-1win.jpg"; } 
      else if (human.wins == 2 && computerAI.wins == 0) {
        ryuStageImage.src = "ryu-stage-O-2win-0win.jpg";
        endGame(human.char);
        gameover = true;
      } else if (human.wins == 2 && computerAI.wins == 1) {
         ryuStageImage.src = "ryu-stage-O-2win-1win.jpg";     
         endGame(human.char);
         gameover = true;
      }
    } else {
      if (human.wins == 1 && computerAI.wins == 0) { ryuStageImage.src = "ryu-stage-X-1win-0win.jpg"; } 
      else if (human.wins == 1 && computerAI.wins == 1) { ryuStageImage.src = "ryu-stage-X-1win-1win.jpg"; } 
      else if (human.wins == 2 && computerAI.wins == 0) {
        ryuStageImage.src = "ryu-stage-X-2win-0win.jpg";
        endGame(human.char);
        gameover = true;
      } else if (human.wins == 2 && computerAI.wins == 1) {
         ryuStageImage.src = "ryu-stage-X-2win-1win.jpg";     
         endGame(human.char);
         gameover = true;
      }  
    }
    
  } else {
    computerAI.wins++;
    // computerAI.scoreHolder.innerHTML = computerAI.wins;
    if (char == "X") {
      if (human.wins == 0 && computerAI.wins == 1) { ryuStageImage.src = "ryu-stage-O-0win-1win.jpg"; } 
      else if (human.wins == 1 && computerAI.wins == 1) { ryuStageImage.src = "ryu-stage-O-1win-1win.jpg"; } 
      else if (human.wins == 0 && computerAI.wins == 2) {
        ryuStageImage.src = "ryu-stage-O-0win-2win.jpg";
        endGame(computerAI.char);
        gameover = true;
      } else if (human.wins == 1 && computerAI.wins == 2) {
         ryuStageImage.src = "ryu-stage-O-1win-2win.jpg";     
         endGame(computerAI.char);
         gameover = true;
      }
    } else {
      if (human.wins == 0 && computerAI.wins == 1) { ryuStageImage.src = "ryu-stage-X-0win-1win.jpg"; } 
      else if (human.wins == 1 && computerAI.wins == 1) { ryuStageImage.src = "ryu-stage-X-1win-1win.jpg"; } 
      else if (human.wins == 0 && computerAI.wins == 2) {
        ryuStageImage.src = "ryu-stage-X-0win-2win.jpg";
        endGame(computerAI.char);
        gameover = true;
      } else if (human.wins == 1 && computerAI.wins == 2) {
         ryuStageImage.src = "ryu-stage-X-1win-2win.jpg";     
         endGame(computerAI.char);
         gameover = true;
      }      
    }
  }
  return true;
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
    // this.scoreHolder = xScore;
  } else {
    // this.scoreHolder = oScore;
  }
  this.turnActive = false;
}

function Computer(char) {
  Player.call(this, char);
  var $that = this;  
  this.difficulty;
  this.turnActive = true;
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

        setupAndRunAnimation(player2Char, true);

        setTimeout(function(){
          setupAndRunAnimation(player1Char, false);
        }, 300);

        setTimeout(function(){
          computerAI.turnActive = false;
        },2000);

        // computerAI.turnActive = true;
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
        setupAndRunAnimation(player2Char, true);

        setTimeout(function(){
          setupAndRunAnimation(player1Char, false);
        }, 300);
        setTimeout(function(){
          computerAI.turnActive = false;
        },2000);
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
  if (!gameover) {
    blackOut.classList.add("fade-in-and-out");
    setTimeout(function(){
        player1CharImg.src = "";
        player2CharImg.src = "";
        player1Char.classList.add("ryu-idle-1p");
        player2Char.classList.add("guile-idle-2p");
      },1000);
    setTimeout(function(){
      blackOut.classList.remove("fade-in-and-out");
    },2000);
    for(var i = 0; i < boardSquares.length; i++) {
      boardSquares[i].innerHTML = '';
    }
    currentGameState = {};
    if (str === "round") {
      human.turnActive = false;
      // computerAI.turnActive = false;
      openSquares = ["0", "1", "2", "3", "4", "5", "6", "7", "8"];
      init();
      roundMedia();
    } else {
      // gameStarted = false;
      // document.body.insertBefore(charSelectScreen, document.body.childNodes[0]);
      // document.body.insertBefore(titleScreen, document.body.childNodes[0]);
    }
    // openSquares = ["0", "1", "2", "3", "4", "5", "6", "7", "8"];
    // init();
  }
}

function charSelect() {
  charSelectedAudio.play();
  for(var i = 0; i < playerSelect.length; i++) {
    playerSelect[i].removeEventListener("mouseenter", charHover);
    playerSelect[i].removeEventListener("click", charSelect);
  }
  if (selectedDifficulty && titleScreenOn === false) {
    human = new Player(this.id);
    if (this.id === "O") { 
      computerAI = new Computer("X");
      console.log("charSelect: "+computerAI.turnActive);
      mapImageFile.src= "ryu-selected-flag.jpg";
    } else {
      computerAI = new Computer("O");
      mapImageFile.src= "guile-selected-flag.jpg";
      vsScreenImage.src= "guile-vs-screen.jpg";
      ryuStageImage.src = "ryu-stage-X-full-health.jpg";
    }
    computerAI.difficulty = selectedDifficulty;
    // for(var i = 0; i < playerSelect.length; i++) {
    //   playerSelect[i].removeEventListener("click", charSelect);
    // }
    selectScreenOn = false;
    setTimeout(function(){
      airplaneAudio.play();
      if (human.char === "O") {
        mapImageFile.src="ryu-selected-animated.gif";
      } else {
        mapImageFile.src="guile-selected-animated.gif";
      }
    }, 1000);
    setTimeout(function(){
      // if (human.char === "X") {
      //   vsScreenImage.src="guile-vs-screen.jpg";
      // }
      charSelectScreen.remove();
      audioMain.stop();
      vsScreenBGM.play();
    }, 4000);
    setTimeout(function(){
      vsScreen.remove();
      roundMedia();
    },9000);
  }
}

function difficultyModeSelect() {
  if(titleScreenOn === false) {
    selectedDifficulty = this.id;
    clickToStartAudio.play()
    for(var i = 0; i < difficultyMode.length; i++) {
      difficultyMode[i].removeEventListener("mouseenter", modeHoverAudio);
      difficultyMode[i].removeEventListener("click", difficultyModeSelect);
    }
    setTimeout(function(){
      difficultySelectScreen.remove();
      charSelectScreenBGM();
    }, 2500);
  }
}

function roundMedia() {
  // blackOut.classList.add("fade-in-and-out");
  setTimeout(function(){
    switch(rounds) {
        case 1: 
          roundImage.src = "round1.gif";
          round1Audio.play();
          break;
        case 2: 
          roundImage.src = "round2.gif";
          round2Audio.play();
          break;        
        case 3: 
          roundImage.src = "round3.gif";
          round3Audio.play();
          break;        
        case 4: 
          roundImage.src = "round4.gif";
          round4Audio.play();
          break;        
        case 5: 
          roundImage.src = "round5.gif";
          round5Audio.play();
          break;
    }
    setTimeout(function(){
      computerAI.turnActive = false;
      roundImage.src = "";
    }, 3000);
  }, 1000);
  
  //AFTER MEDIA PLAY
  
  //play audio file
  //CASE
}

function endGame(char, char2) {
  //if char2 exists, then 5 rounds have passed
  if (char2) {
    if (char > char2) {
      //human wins
      console.log(char + "wins");
    } else if (char < char2) {
      //computer wins
      console.log(char2 + "wins");
    } else {
      //draw
      console.log("draw");
    }
  } else {
    if (char == human.wins) {
      if (char == "X") {
        alert("END GAME");
        // endScreenImage.src = "guile-1p-win-ryu-2p-lose";
        //Ryu win Guile lose image
      } else {
        //Guile win Ryu lose image
        //NOT NECESSARY, IMAGE ALREADY LOADED
      }
    } else {
      if (char == "O") {
        // endScreenImage.src = "ryu-1p-lose-guile-2p-win";
        //Guile lose Ryu win image
      } else {
        // endScreenImage.src = "guile-1p-lose-ryu-2p-win";
        //Ryu lose Guile win image
      }
    }
  }

  setTimeout(function(){
    window.location.reload();
  }, 5000);

}

// https://stackoverflow.com/questions/17333777/uncaught-reference-error-bufferloader-is-not-defined
function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}
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