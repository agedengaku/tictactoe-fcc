var playerSelect = document.getElementsByClassName("player-select");
var boardSquare = document.getElementsByClassName("board-square");

var newBoard = new Board();
var newGameState = new GameState();
var human = new Player;
human.char = 'X';
var computer = new Player;
computer.char = 'O'; 
  // for(var i = 0; i < playerSelect.length; i++) {
  //   playerSelect[i].addEventListener("click", function(){
  //     alert("You selected: " + this.innerHTML);
  //     var one = new Human();
  //     var two = new Computer();
  //     one.char = this.innerHTML;
  //     if (one.char === "X") { 
  //       two.char = "Y"; 
  //     } else {
  //       two.char = "X"; 
  //     }
  //     alert("One: " + one.char);
  //     alert("Two: " + two.char)
  //   });
  // }

for(var i = 0; i < boardSquare.length; i++) {
  boardSquare[i].onclick = setClicked; 
}

function setClicked(){
  var squareId = this.id;
  if (newBoard[squareId][0] === false){
    newBoard[squareId][0] = true;
    newBoard[squareId][1] = human.char;
    this.innerHTML = human.char;
    newGameState.turnsTaken++;
    if (newGameState.turnsTaken > 2 && newGameState.turnsTaken < 9) {
      newGameState.checkForWinner(squareId, human.char);
      console.log(newBoard.a1 + newBoard.a2 + newBoard.a3);
    }
    if (newGameState.turnsTaken === 9) {
      newGameState.checkForWinner("draw");
    }
  }
}

function GameState() {
  this.winCounter;
  this.turnsTaken = 0;
  this.checkForWinner = function(data, char) {
    if (data !== "draw") {
      var message;
      if (message = winCombination(data, char)) {
        alert(message);
      }
    } else {
      alert("draw");
    }
  }
  this.gameOver = function() {
  }
}

function winCombination (data, char) {
  alert('check');
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

function horizontal1(char) {
  if (char === newBoard.a1[1] && newBoard.a1[1] === newBoard.a2[1] && newBoard.a2[1] === newBoard.a3[1]) {
    return true;
  } else {
    return false;
  }
}
function horizontal2(char) {
  if (char === newBoard.b1[1] && newBoard.b1[1] === newBoard.b2[1] && newBoard.b2[1] === newBoard.b3[1]) {
    return true;
  } else {
    return false;
  }
}
function horizontal3(char) {
  if (char === newBoard.c1[1] && newBoard.a1[1] === newBoard.c2[1] && newBoard.c2[1] === newBoard.c3[1]) {
    return true;
  } else {
    return false;
  }
}
function vertical1(char) {
  if (char === newBoard.a1[1] && newBoard.a1[1] === newBoard.b1[1] && newBoard.b1[1] === newBoard.c1[1]) {
    return true;
  } else {
    return false;
  }
}        
function vertical2(char) {
  if (char === newBoard.a2[1] && newBoard.a2[1] === newBoard.b2[1] && newBoard.b2[1] === newBoard.c2[1]) {
    return true;
  } else {
    return false;
  }
}    
function vertical3(char) {
  if (char === newBoard.a3[1] && newBoard.a3[1] === newBoard.b3[1] && newBoard.b3[1] === newBoard.c3[1]) {
    return true;
  } else {
    return false;
  }
}
function diagonal1(char) {
  if (char === newBoard.a1[1] && newBoard.a1[1] === newBoard.b2[1] && newBoard.b2[1] === newBoard.c3[1]) {
    return true;
  } else {
    return false;
  }      
}    
function diagonal2(char) {
  if (char === newBoard.a3[1] && newBoard.a3[1] === newBoard.b2[1] && newBoard.b2[1] === newBoard.c1[1]) {
    return true;
  } else {
    return false;
  }      
}



//info of board squares

function Board(squareIds) {
//each var contains true/false (square clicked), and if clicked contains which player
 this.a1 = [false, undefined];
 this.a2 = [false, undefined];
 this.a3 = [false, undefined];
 this.b1 = [false, undefined];
 this.b2 = [false, undefined];
 this.b3 = [false, undefined];
 this.c1 = [false, undefined];
 this.c2 = [false, undefined];
 this.c3 = [false, undefined];
}


//number of wins
//X or O
function Player() {
  this.char;
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