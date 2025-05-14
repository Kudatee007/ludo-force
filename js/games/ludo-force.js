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
  const dice_img = document.getElementById("diceImg");

  // console.log(red_house);

  //Initial variables
  let playerPieces = [];
  let playerTurn = [];
  let currentPlayerTurnIndex = 0;
  let prevPlayerTurnIndex;
  let currentPlayerTurnStatus = true;
  let teamHasBonus = false;

  // let diceResult;

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

    unlockPiece() {
      this.status = true;
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
      if (nextPositionCell) {
        const tokenEl = document.getElementById(this.id);
        nextPositionCell.appendChild(tokenEl);
        this.position = nextPosition;
      }
    }
    // function to return the piece to the locked position when killed
    sentMeToBoard() {}
  }

  let numberOfPlayers = 4;

  let boardDetails = [
    { boardColor: "blue", board: blue_house, homeEntry: "14", gameEntry: "b1" },
    {
      boardColor: "yellow",
      board: yellow_house,
      homeEntry: "12",
      gameEntry: "b1",
    },
    {
      boardColor: "green",
      board: green_house,
      homeEntry: "40",
      gameEntry: "b1",
    },
    { boardColor: "red", board: red_house, homeEntry: "1", gameEntry: "b1" },
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
        //user turn
      });

      // let pieceID = `${boardColor}${i}`;
      let position = `${i}_${boardColor}`;

      const Player = new Token(boardColor, position, 0, homeEntry, gameEntry);
      span.setAttribute("id", position);
      playerPieces.push(Player);
      parentDiv.append(span);
    }

    boardDetails[i].board.append(parentDiv);
  }
});

if (numberOfPlayers == 2) {
  playerTurn = ["blue", "yellow"];
} else if (numberOfPlayers == 3) {
  playerTurn = ["red", "blue", "green"];
} else playerTurn = ["red", "blue", "green", "yellow"];

rollDiceBtn.addEventListener("click", () => {
  rollDice.src = rollDiceGif.src;
  diceResult = Math.floor(Math.random() * 6) + 1;

  setTimeout(() => {
    dice_img.src = `/images/dice_${diceResult}.png`
  }, 600)
});
