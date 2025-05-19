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
  // const Player = new Token(position, boardColor, 0, 0, homePathEntry, gameEntry);
  class Token {
    constructor(PlayerId, team, position, score, homePathEntry, gameEntry) {
      this.team = team;
      this.position = position;
      this.score = score;
      this.homePathEntry = homePathEntry; // Number
      this.PlayerId = PlayerId;
      this.gameEntry = gameEntry;
      this.status = false; // when true

      this.initailPosition = position; // return piece to start position
      this.stepsMoved = 0;
    }

    // methods
    unlockPiece(startCellId) {
      this.status = true;
      const tokenEl = document.getElementById(this.PlayerId);
      const startCell = document.getElementById(`cell-${this.gameEntry}`);
      if (tokenEl && startCell) {
        startCell.appendChild(tokenEl);
        this.position = this.gameEntry; // Set actual board position
      }
    }
    updatePosition(position) {
      this.position = this.position;
    }
    movePiece(steps) {
      let nextPosition = this.position + steps;
      const nextPositionCell = document.getElementById(`cell-${nextPosition}`);
      
      const tokenEl = document.getElementById(this.PlayerId);

      this.stepsMoved += steps; // track total movement

      if (nextPosition > 52) {
        nextPosition -= 52;
      }

      // position to move the piece inside home
      // if (nextPosition >= this.homeEntryCell) {
      //   this.homePathEntry(nextPosition - this.homeEntryCell);
      //   return;
      // }
      
      // position to move the piece
      if (nextPositionCell && tokenEl) {
        nextPositionCell.appendChild(tokenEl);
        this.position = nextPosition;
      }
    }
    enterHomePath() {
      const tokenEl = document.getElementById(this.PlayerId);
      let homeIndex = this.stepsMoved + steps;

      // if (homeIndex > 5 || homeIndex < 1) {
      //   alert("Can't move: overshoot home path");
      //   return;
      // }

      const homeCellId = `cell-${this.team}-home-${homeIndex + 1}`;
      const homeCell = document.getElementById(homeCellId);
      console.log(homeCell);

      if (homeCell && tokenEl) {
        homeCell.appendChild(tokenEl);
        this.position = `cell-${this.team}-home-${homeIndex + 1}` + steps; // update to home path
        console.log(`${this.PlayerId} entered home path at ${homeCellId}`);
      } else {
        alert("Invalid home cell.");
      }
    }

    // function to return the piece to the locked position when killed
    sentMeToBoard() {}
  }

  let numberOfPlayers = 4;

  let boardDetails = [
    {
      boardColor: "blue",
      board: blue_house,
      homePathEntry: "12",
      gameEntry: 14,
    },
    {
      boardColor: "yellow",
      board: yellow_house,
      homePathEntry: "38",
      gameEntry: 40,
    },
    {
      boardColor: "green",
      board: green_house,
      homePathEntry: "25",
      gameEntry: 27,
    },
    {
      boardColor: "red",
      board: red_house,
      homePathEntry: "51",
      gameEntry: 1,
    },
  ];

  for (let i = 0; i < numberOfPlayers; i++) {
    let boardColor = boardDetails[i].boardColor;
    let homePathEntry = boardDetails[i].homePathEntry;
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

      const Player = new Token(
        position,
        boardColor,
        0,
        0,
        homePathEntry,
        gameEntry
      );
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
      document.getElementById("dice-result").textContent =
        `Roll: ${diceResult}`;

      const selected = document.querySelector(".token.selected");
      // if (!selected) {
      //   alert("Please select a token to move.");
      //   return;
      // }

      const selectedId = selected.id;
      console.log(selectedId);

      console.log(playerPieces);

      const tokenObj = playerPieces.find((p) => p.PlayerId === selectedId);
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
        console.log(diceResult);

        if (diceResult === 6) {
          alert("You rolled a 6! Play again.");
        } else {
          // switch to next player's turn here
          // alert("next player turn")
        }
      } else {
        alert("This piece is still locked. You need a 6 to unlock it.");
      }
    }, 600);
  });
});
