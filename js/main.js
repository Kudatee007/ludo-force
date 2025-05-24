// console.log(Number(cell.toString().split("-")[1]) + 42);


// importing all boards
window.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded");
    const green_house = document.getElementById("green-house");
    const blue_house = document.getElementById("blue-house");
    const yellow_house = document.getElementById("yellow-house");
    const red_house = document.getElementById("red-house");
    const rollDiceBtn = document.getElementById("roll-btn");
    const rollDice = document.getElementById("diceImg");
    const result = document.getElementById("dice-result");
  
    // console.log(red_house);
  
    //Initial variables
    // let playerPieces = [];
    // let playerTurns = [];
    let playerTurns = [];
    let currentPlayerTurnIndex = 0;
    let prevPlayerTurnIndex;
    let currentPlayerTurnStatus = true;
    let teamHasBonus = false;
  
    let diceResult;
    // const Player = new Token(position, boardColor, 0, 0, homePathEntry, gameEntry);
    let boardDetails = [
      {
        boardColor: "blue",
        board: blue_house,
        homePathEntry: "b13",
        gameEntry: "b1",
      },
  
      {
        boardColor: "green",
        board: green_house,
        homePathEntry: "g13",
        gameEntry: "g1",
      },
      {
        boardColor: "red",
        board: red_house,
        homePathEntry: "r13",
        gameEntry: "r1",
      },
      {
        boardColor: "yellow",
        board: yellow_house,
        homePathEntry: "y13",
        gameEntry: "y1",
      },
    ];
  
    const pathArray = [
      "r1",
      "r2",
      "r3",
      "r4",
      "r5",
      "r6",
      "r7",
      "r8",
      "r9",
      "r10",
      "r11",
      "r12",
      "r13",
      "b1",
      "b2",
      "b3",
      "b4",
      "b5",
      "b6",
      "b7",
      "b8",
      "b9",
      "b10",
      "b11",
      "b12",
      "b13",
      "g1",
      "g2",
      "g3",
      "g4",
      "g5",
      "g6",
      "g7",
      "g8",
      "g9",
      "g10",
      "g11",
      "g12",
      "g13",
      "y1",
      "y2",
      "y3",
      "y4",
      "y5",
      "y6",
      "y7",
      "y8",
      "y9",
      "y10",
      "y11",
      "y12",
      "y13",
    ];
    let homePathEntries = {
      red: ["rh1", "rh2", "rh3", "rh4", "rh5"],
      blue: ["bh1", "bh2", "bh3", "bh4", "bh5"],
      green: ["gh1", "gh2", "gh3", "gh4", "gh5"],
      yellow: ["yh1", "yh2", "yh3", "yh4", "yh5"],
    };
  
    let safePaths = [
      ...homePathEntries.blue,
      ...homePathEntries.yellow,
      ...homePathEntries.green,
      ...homePathEntries.red,
    ];
  
    let homePathArray = [
      ...homePathEntries.blue,
      ...homePathEntries.yellow,
      ...homePathEntries.green,
      ...homePathEntries.red,
    ];
    class Token {
      constructor(team, position, score, homePathEntry, PlayerId, gameEntry) {
        this.team = team;
        this.position = position;
        this.score = score;
        this.homePathEntry = homePathEntry; // Number
        this.id = PlayerId;
        this.gameEntry = gameEntry;
        this.status = 0; // when true
  
        this.initailPosition = position; // return piece to start position
        this.stepsMoved = 0;
      }
  
      // methods
      unlockPiece() {
        this.status = 1;
        this.position = this.gameEntry;
        const tokenEl = document.querySelector(`[piece_id="${this.id}"]`);
        const startCell = document.getElementById(this.gameEntry);
        startCell.appendChild(tokenEl);
        console.log("token unlocked");
      }
      updatePosition(position) {
        this.position = position;
      }
      movePiece(array) {
        this.stepsMoved += steps; // to track total movement
      }
      enterHomePath(stepsIntoHome) {
      }
  
      // function to return the piece to the locked position when killed
      sentMeToBoard() {}
    }
  
    let numberOfPlayers = 4;
    let playerPieces = [];
  
  
    const turnForUser = async (e) => {
      try {
        let isUserTurn = playerTurns[currentPlayerTurnIndex] === "red";
        let currentTeamTurn = playerTurns[currentPlayerTurnIndex];
  
        if (!isUserTurn || !currentPlayerTurnStatus) {
          return;
        }
  
        let piece = playerPieces.find(
          (obj) =>
            obj.id === e.target.getAttribute("piece_id") &&
            obj.team === currentTeamTurn
        );
  
        if (!piece) {
          console.warn("Token not found for event target:", e.target);
          return;
        }
  
        let array = giveArrayForMovingPath(piece);
  
        if (array.length < diceResult) {
          return;
        }
  
        if (diceResult === 6) {
          currentPlayerTurnStatus = true;
          if (piece.status === 0) {
            piece.unlockPiece();
            return;
          }
          piece.movePiece(array);
        } else {
          if (piece.status === 0) {
            return;
          }
          currentPlayerTurnStatus = true;
          piece.movePiece(array);
          if (!teamHasBonus) {
            nextTeamTurn();
          }
        }
  
        console.log(
          "User clicked token",
          piece.id,
          "with status",
          piece.status,
          "diceResult:",
          diceResult
        );
      } catch (err) {
        console.error("Error in turnForUser:", err);
      }
    };
  
    for (let i = 0; i < numberOfPlayers; i++) {
      let boardColor = boardDetails[i].boardColor;
      let homePathEntry = boardDetails[i].homePathEntry;
      let gameEntry = boardDetails[i].gameEntry;
  
      const parentDiv = document.createElement("div");
      parentDiv.classList.add("board");
      for (let i = 0; i < 4; i++) {
        const span = document.createElement("span");
        const icon = document.createElement("i");
        icon.classList.add(
          "fa-solid",
          "fa-location-pin",
          "piece",
          `${boardColor}-piece`
        );
        // span.classList.add("token", `${boardColor}-piece`);
        icon.addEventListener("click", (e) => {
          console.log("Clicked element:", e.target);
          console.log("piece_id:", e.target.getAttribute("piece_id"));
          turnForUser(e);
        });
  
        let pieceID = `${boardColor}${i}`;
        let position = `${i}_${boardColor}`;
  
        const player = new Token(
          boardColor,
          position,
          0,
          homePathEntry,
          pieceID,
          gameEntry // <- This is extra
        );
        span.setAttribute("id", position);
        icon.setAttribute("piece_id", pieceID);
        playerPieces.push(player);
        span.append(icon);
        parentDiv.append(span);
        // console.log(span);
      }
  
      boardDetails[i].board.append(parentDiv);
    }
  
    if (numberOfPlayers == 2) {
      playerTurns = ["blue", "yellow"];
    } else if (numberOfPlayers == 3) {
      playerTurns = ["red", "blue", "green"];
    } else if (numberOfPlayers == 4)
      playerTurns = ["red", "blue", "green", "yellow"];
  
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  
    const setPlayerTurn = (playerTurnIndex) => {
      if (playerTurnIndex === null || playerTurnIndex === undefined) {
        return;
      }
  
      let currentTeamTurn = playerTurns[playerTurnIndex];
      // filtering the board details arrays and finding the currenTeam
      let boardDetailObject = boardDetails.filter(
        (obj) => obj.boardColor === currentTeamTurn
      );
      boardDetailObject[0].board.classList.toggle("active");
    };
  
    setPlayerTurn(0);
  
    const nextTeamTurn = async () => {
      prevPlayerTurnIndex = currentPlayerTurnIndex;
  
      if (currentPlayerTurnIndex === playerTurns.length - 1) {
        currentPlayerTurnIndex = 0;
      } else {
        currentPlayerTurnIndex += 1;
      }
  
      setPlayerTurn(prevPlayerTurnIndex);
      setPlayerTurn(currentPlayerTurnIndex);
  
      await delay(500);
      // const currentTeam = playerTurns[currentPlayerTurnIndex];
      if (playerTurns[currentPlayerTurnIndex] !== "red") {
        // rollDiceForBot();
      }
    };
  
    const giveArrayForMovingPath = (piece) => {
      let indexOfPath;
      let movingArray = [];
  
      if (!pathArray.includes(piece.position)) {
        indexOfPath = homePathEntries[piece.team].findIndex(
          (elem) => elem === piece.position
        );
        let homePathArrayForPiece = homePathEntries[piece.team];
  
        for (let i = 0; i < diceResult; i++) {
          if (indexOfPath + 1 < homePathArrayForPiece.length) {
            indexOfPath += 1;
            movingArray.push(homePathArrayForPiece[indexOfPath]);
          } else {
            break; // exit the loop if the end of the home path array is reached
          }
        }
      } else {
        indexOfPath = pathArray.findIndex((elem) => elem === piece.position);
  
        for (let i = 0; i < diceResult; i++) {
          indexOfPath = (indexOfPath + 1) % pathArray.length;
          movingArray.push(pathArray[indexOfPath]);
        }
      }
      return movingArray;
    };
  
    // const turnForUser = async (e) => {
    //   console.log("turnForUser called");
    //   let isUserTurn = playerTurns[currentPlayerTurnIndex] === "red";
    //   let currentTeamTurn = playerTurns[currentPlayerTurnIndex];
  
    //   // Return user if user has used it chance or the current turn is not for user
    //   if (!isUserTurn || !currentPlayerTurnStatus) {
    //     return;
    //   }
  
    //   // If user has any unlocked pieces
    //   let totalUnlockedPieces = playerPieces.filter(
    //     (obj) => obj.team === currentTeamTurn && obj.status === 1
    //   ).length;
  
    //   let piece = playerPieces.find(
    //     (obj) =>
    //       obj.id === e.target.getAttribute("piece_id") &&
    //       // obj.id === e.currentTarget.getAttribute("piece_id") &&
    //       obj.team === currentTeamTurn
    //   );
  
    //   if (!piece) {
    //     console.warn("Token not found for event target:", e.target);
    //     return;
    //   }
  
    //   let array = giveArrayForMovingPath(piece);
  
    //   if (array.length < diceResult) {
    //     return;
    //   }
    //   if (diceResult === 6) {
    //     currentPlayerTurnStatus = true;
    //     if (piece.status === 0) {
    //       piece.unlockPiece();
    //       return;
    //     }
    //     piece.movePiece(array);
    //   } else {
    //     if (piece.status === 0) {
    //       return;
    //     }
    //     currentPlayerTurnStatus = true;
    //     piece.movePiece(array);
    //     if (!teamHasBonus) {
    //       nextTeamTurn();
    //     }
    //   }
  
    //   console.log(
    //     "User clicked token",
    //     piece.id,
    //     "with status",
    //     piece.status,
    //     "diceResult:",
    //     diceResult
    //   );
    // };
  
  
  
    const rollDiceGif = new Image();
    rollDiceGif.src = "../../images/animated-dice-image-0040.gif";
  
    rollDiceBtn.addEventListener("click", async () => {
      let currentTeamTurn = playerTurns[currentPlayerTurnIndex];
  
      if (!currentPlayerTurnStatus) return;
  
      rollDiceBtn.disabled = true;
      rollDice.src = rollDiceGif.src;
      // diceResult = Math.floor(Math.random() * 6) + 1;
      diceResult = 6;
      result.textContent = diceResult
      currentPlayerTurnStatus = false;
      teamHasBonus = false;
  
      setTimeout(async () => {
        rollDice.src = `/images/dice_${diceResult}.png`;
        await delay(700);
        rollDiceBtn.disabled = false;
  
        let totalUnlockedPieces = playerPieces.filter(
          (obj) => obj.team === currentTeamTurn && obj.status === 1
        );
  
        if (
          totalUnlockedPieces.length === 0 &&
          diceResult !== 6 &&
          !teamHasBonus
        ) {
          await delay(500);
          currentPlayerTurnStatus = true;
          nextTeamTurn();
        }
      }, 600);
    });
  
    const rollDiceForBot = () => {
      if (!currentPlayerTurnStatus) return;
  
      rollDice.src = rollDiceGif.src;
      diceResult = Math.floor(Math.random() * 6) + 1;
      currentPlayerTurnStatus = false;
      teamHasBonus = false;
  
      setTimeout(async () => {
        rollDice.src = `/images/dice_${diceResult}.png`;
        await delay(700);
        rollDiceBtn.disabled = false;
  
        // turnForBot()
      }, 600);
    };
  });
  