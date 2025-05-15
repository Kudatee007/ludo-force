// Select the game board container
// const gameArea = document.getElementById("game-area");
// const gameBoard = document.getElementById("game-board");
// const rollBtn = document.getElementById("roll-btn");
// const diceResult = document.getElementById("dice-result");
// const token = document.getElementById("token");

// house path
// const redHouse = ["r1", "r2", "r3", "r4", "r5"];

// let currentCellId = 1; // Start from cell with id="1"
// let inHouse = false;
// let houseIndex = 0;

// roll dice
// rollBtn.addEventListener("click", () => {

//   const diceRoll = Math.floor(Math.random() * 6) + 1;
//   diceResult.textContent = `Roll: ${diceRoll}`;

//   let nextCellId = currentCellId + diceRoll;
//   const nextCell = document.getElementById(`cell-${nextCellId}`);

//   // Prevent moving out of board
//   if (!nextCell) {
//     alert("Move out of range");
//     return;
//   }

//   if (selectedToken) {
//     // Move token
//   nextCell.appendChild(token);
//   currentCellId = nextCellId;
//   }
// });

// 1. Handle selecting a token
// document.querySelectorAll(".token").forEach(token => {
//   token.addEventListener("click", () => {
//     selectedToken = token;
//     // Highlight it visually if you want
//     document.querySelectorAll(".token").forEach(t => t.classList.remove("selected"));
//     token.classList.add("selected");
//   });
// });

// roll dice
// rollBtn.addEventListener("click", () => {
//   const diceRoll = Math.floor(Math.random() * 6) + 1;
//   diceResult.textContent = `Roll: ${diceRoll}`;

//   let nextCellId = currentCellId + diceRoll;
//   const nextCell = document.getElementById(`cell-${nextCellId}`);

//   // Prevent moving out of board
//   if (!nextCell) {
//     alert("Move out of range");
//     return;
//   }

//   if (selectedToken) {
//     // Move token
//     nextCell.appendChild(token);
//     currentCellId = nextCellId;
//   }
// });

// 1. Handle selecting a token
// document.querySelectorAll(".token").forEach((token) => {
//   token.addEventListener("click", () => {
//     if (rolledValue === null) {
//       alert("Please roll the dice first.");
//       return;
//     }

//     const tokenId = token.dataset.id;
//     let current = tokenPositions[tokenId];
//     let next = current + rolledValue;

//     selectedToken = token;
//     // Highlight it visually if you want
//     document
//       .querySelectorAll(".token")
//       .forEach((t) => t.classList.remove("selected"));
//     token.classList.add("selected");
//   });
// });

// importing all boards
document.addEventListener("DOMContentLoaded", () => {
  const green_house = document.getElementById("green-house");
  const blue_house = document.getElementById("blue-house");
  const yellow_house = document.getElementById("yellow-house");
  const red_house = document.getElementById("red-house");
  const rollDiceBtn = document.getElementById("roll-btn");
  const rollDice = document.getElementById("diceImg");

  // console.log(red_house);

  //Initial variables
  let playerPieces = [];
  let playerTurn = [];
  let currentPlayerTurnIndex = 0;
  let prevPlayerTurnIndex;
  let currentPlayerTurnStatus = true;
  let teamHasBonus = false;

  let diceResult;
  // const Player = new Token(position, boardColor, 0, 0, homeEntry, gameEntry);
  class Token {
    constructor(PlayerId, team, position, score, homePathEntry, gameEntry) {
      this.team = team;
      this.position = position;
      this.score = score;
      this.homePathEntry = homePathEntry;
      this.PlayerId = PlayerId;
      this.gameEntry = gameEntry;
      this.status = false; // when true

      this.initailPosition = position; // return piece to start position
    }

    // methods
    unlockPiece(startCellId) {
      this.status = true;
      const tokenEl = document.getElementById(this.PlayerId);
      const startCell = document.getElementById(`cell-${this.gameEntry}`);
      if (tokenEl && startCell) {
        startCell.appendChild(tokenEl);
        this.position = parseInt(this.gameEntry); // Set actual board position
      }
    }
    updatePosition(position) {
      this.position = this.position;
    }
    movePiece(steps) {
      // position to move the piece
      let nextPosition = this.position + steps;

      if (nextPosition > 72) {
        alert("Can't move: out of bounds");
        return;
      }

      const nextPositionCell = document.getElementById(nextPosition);
      const tokenEl = document.getElementById(this.PlayerId);

      if (nextPositionCell && tokenEl) {
        nextPositionCell.appendChild(tokenEl);
        this.position = nextPosition;
      }
    }
    // function to return the piece to the locked position when killed
    sentMeToBoard() {}
  }

  let numberOfPlayers = 4;

  let boardDetails = [
    { boardColor: "blue", board: blue_house, homeEntry: "1", gameEntry: "14" },
    {
      boardColor: "yellow",
      board: yellow_house,
      homeEntry: "1",
      gameEntry: "40",
    },
    {
      boardColor: "green",
      board: green_house,
      homeEntry: "4",
      gameEntry: "27",
    },
    { boardColor: "red", board: red_house, homeEntry: "r1", gameEntry: "1" },
  ];

  for (let i = 0; i < numberOfPlayers; i++) {
    let boardColor = boardDetails[i].boardColor;
    let homeEntry = boardDetails[i].homeEntry;
    let gameEntry = boardDetails[i].gameEntry;

    const parentDiv = document.createElement("div");
    parentDiv.classList.add("house");
    for (let j = 0; j < 4; j++) {
      const span = document.createElement("span");
      span.classList.add("token", boardColor);
      span.addEventListener("click", () => {
        const allTokens = document.querySelectorAll(".token.selected");
        allTokens.forEach((token) => token.classList.remove("selected"));
        // Select the clicked token
        span.classList.add("selected");
      });

      // let pieceID = `${boardColor}${i}`;
      let position = `${j}_${boardColor}`;

      const Player = new Token(position, boardColor, 0, 0, homeEntry, gameEntry);
      span.setAttribute("id", position);
      playerPieces.push(Player);
      parentDiv.append(span);
    }

    boardDetails[i].board.append(parentDiv);
  }

  if (numberOfPlayers == 2) {
    playerTurn = ["blue", "yellow"];
  } else if (numberOfPlayers == 3) {
    playerTurn = ["red", "blue", "green"];
  } else playerTurn = ["red", "blue", "green", "yellow"];

  const rollDiceGif = new Image();
  rollDiceGif.src = "../../images/animated-dice-image-0040.gif";

  rollDiceBtn.addEventListener("click", () => {
    rollDice.src = rollDiceGif.src;
    diceResult = Math.floor(Math.random() * 6) + 1;

    setTimeout(() => {
      rollDice.src = `/images/dice_${diceResult}.png`;
      document.getElementById("dice-result").textContent = `Roll: ${diceResult}`;

      const selected = document.querySelector(".token.selected");
      // if (!selected) {
      //   alert("Please select a token to move.");
      //   return;
      // }


    const selectedId = selected.id;
    console.log(selectedId);
    
    console.log(playerPieces);
    
    const tokenObj = playerPieces.find(p => p.PlayerId === selectedId);
    console.log(tokenObj);
    

    if (!tokenObj) {
      alert("Invalid token.");
      return;
    }

    if (!tokenObj.status && diceResult === 6) {
      tokenObj.unlockPiece();
      alert("Piece unlocked! Roll again.");
      return;
    }

    if (tokenObj.status) {
      tokenObj.movePiece(diceResult);
      if (diceResult === 6) {
        alert("You rolled a 6! Play again.");
      } else {
        // switch to next player's turn here
      }
    } else {
      alert("This piece is still locked. You need a 6 to unlock it.");
    }
    }, 600);

    if (diceResult === 6) {
      movePiece();
      alert("ok");
    }
  });
});
