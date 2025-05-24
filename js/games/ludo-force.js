// importing all boards
window.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded");
  const green_house = document.getElementById("green-house");
  const blue_house = document.getElementById("blue-house");
  const yellow_house = document.getElementById("yellow-house");
  const red_house = document.getElementById("red-house");
  const rollDiceBtn = document.getElementById("roll-btn");
  const rollDice = document.getElementById("diceImg");

  if (!red_house) {
    console.warn("Missing #red-house element");
  }

  // console.log(red_house);

  //Initial variables
  let playerTurns = [];
  let currentPlayerTurnIndex = 0;
  let prevPlayerTurnIndex;
  let currentPlayerTurnStatus = true;
  let teamHasBonus = false;

  let diceResult;
  // const Player = new Token(position, boardColor, 0, 0, homePathEntry, gameEntry);

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
      let filteredArray = array;

      tokenToMove(this.id, filteredArray);
      this.score += filteredArray.length;
    }
    enterHomePath(stepsIntoHome) {}

    // function to return the piece to the locked position when killed
    sentMeToBoard() {}
  }

  const boardDetails = [
    {
      boardColor: "red",
      board: red_house,
      homePathEntry: "r13",
      gameEntry: "r1",
    },
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
      boardColor: "yellow",
      board: yellow_house,
      homePathEntry: "y13",
      gameEntry: "y1",
    },
  ];

  let numberOfPlayers = 4;
  let playerPieces = [];

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

      let pieceID = `${boardColor}${i}`;
      let position = `${i}_${boardColor}`;

      span.setAttribute("id", position);
      icon.setAttribute("piece_id", pieceID);

      // icon.setAttribute("piece_id", `${boardColor}-${i}`);
      // span.classList.add("token", `${boardColor}-piece`);
      icon.addEventListener("click", (e) => {
        console.log("Clicked element:", e.target);
        console.log("piece_id:", e.target.getAttribute("piece_id"));
        turnForUser(e);
      });

      // const player = new Token(
      //   pieceID,
      //   boardColor,
      //   0,
      //   0,
      //   homePathEntry,
      //   gameEntry // <- This is extra
      // );
      const player = new Token(
        boardColor,
        position,
        0,
        homePathEntry,
        pieceID,
        gameEntry // <- This is extra
      );
      playerPieces.push(player);
      span.append(icon);
      parentDiv.append(span);
      // console.log(span);
    }

    boardDetails[i].board.append(parentDiv);
  }

  if (numberOfPlayers == 2) {
    playerTurns = ["red", "green"];
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
      rollDiceForBot();
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

  const tokenToMove = (tokenId, array) => {
    const tokenToMove = document.querySelector(`[piece_id="${tokenId}"]`);
    let currentTeamTurn = playerTurns[currentPlayerTurnIndex];
    let piece = playerPieces.find((obj) => obj.id === tokenId);
    let toBreak = false;

    // funtion to move to next
    function moveToNextTarget(index) {
      if (index >= array.length) return;

      const currentTarget = document.getElementById(array[index]);

      if (array[index] === "home") {
        let indexOfPiece = playerPieces.findIndex((obj) => obj.id === piece.id);
        playerPieces.splice(indexOfPiece, 1);
        tokenToMove.remove();
        toBreak = true;
        if (currentTeamTurn === "red") {
          currentPlayerTurnStatus = true;
        } else {
          rollMyDice(true);
        }
        return;
      }
      piece.updatePosition(array[index]);

      //Append the element to the current target
      currentTarget.appendChild(tokenToMove);

      setTimeout(() => {
        moveToNextTarget(index + 1);
      }, 170);
    }

    !toBreak && moveToNextTarget(0);
  };

  const rollMyDice = async (hasBonus) => {
    currentPlayerTurnStatus = true;
    await delay(700);
    if (diceResult === 6 || hasBonus || teamHasBonus) {
      rollDiceForBot();
    } else {
      nextTeamTurn();
      if (playerTurns[currentPlayerTurnIndex] !== "red") rollDiceForBot();
    }
  };

  const moveMyPiece = async (piece) => {
    let array = giveArrayForMovingPath(piece);
    if (array.length < diceResult) {
      return false;
    }

    piece.movePiece(array);
    await delay(array.length * 175);
    rollMyDice();
    return true;
  };

  const giveEnemiesBehindMe = async () => {
    let currentTeamTurn = playerTurns[currentPlayerTurnIndex];
    let indexOfPath = pathArray.findIndex((elem) => elem === piece.position);
    if (!indexOfPath) {
      return 0;
    }

    let lastSixPath = [];

    for (let i = 6; i < 6; i--) {
      let index = (indexOfPath - i + pathArray.length) % pathArray.length;
      lastSixPath.push(pathArray[index]);
    }

    let opponentsOnPath = playerPieces.filter(
      (obj) =>
        lastSixPath.includes(obj.position) && obj.team !== currentTeamTurn
    );

    return opponentsOnPath.length;
  };

  const turnForBot = async () => {
    let currentTeamTurn = playerTurns[currentPlayerTurnIndex];
    let totalUnlockedPieces = playerPieces.filter(
      (obj) => obj.team === currentTeamTurn && obj.status === 1
    );
    let totalPiecesOfTheTeam = playerPieces.filter(
      (obj) => obj.team === currentTeamTurn
    ).length;
    let isMoving = false;

    if (totalUnlockedPieces.length === 0 && diceResult !== 6) {
      rollMyDice();
      return;
    }

    currentPlayerTurnStatus = true;
    let piece_team = playerPieces.filter((obj) => obj.team === currentTeamTurn);
    // condition when bot has 0 pieces unlocked
    if (totalUnlockedPieces.length === 0 && diceResult === 6) {
      piece_team[0].unlockPiece();
      rollMyDice();
      return;
    }

    //logic for kill detection
    let lockedPieces = playerPieces.filter(
      (obj) => obj.team === currentTeamTurn && obj.status === 0
    );
    const attemptMove = async (piece) => {
      if (!(await moveMyPiece(piece))) {
        return false;
      }
      isMoving = true;
      return true;
    };

    // condition when user has 1 unlocked pieces
    if (totalUnlockedPieces.length === 1) {
      if (totalUnlockedPieces.length <= 3 && diceResult === 6) {
        lockedPieces[0].unlockPiece();
        rollMyDice();
        return;
      }
      let piece = totalUnlockedPieces.find((obj) => obj.status === 1);
      if (!(await attemptMove(piece)));
    }

    // condition when user has 2 unlocked pieces
    if (totalUnlockedPieces.length === 2) {
      if (
        totalUnlockedPieces <= 3 &&
        diceResult === 6 &&
        totalPiecesOfTheTeam >= 3
      ) {
        lockedPieces[0].unlockPiece();
        rollMyDice();
        return;
      }
      // let piece = totalUnlockedPieces.find(obj=>obj.status === 1)
      // if(!await attemptMove(piece));
      let pieceSafe = totalUnlockedPieces.filter((obj) =>
        safePaths.includes(obj.position)
      );
      let pieceUnSafe = totalUnlockedPieces.filter(
        (obj) => !safePaths.includes(obj.position)
      );

      if (pieceSafe.length === 0) {
        let scoreOfFirstPiece = pieceUnSafe[0].score;
        let scoreOfSecondPiece = pieceUnSafe[1].score;

        if (scoreOfSecondPiece > scoreOfFirstPiece) {
          if (!(await attemptMove(pieceUnSafe[1]))) return;
        } else {
          if (!(await attemptMove(pieceUnSafe[0]))) return;
        }
      }

      if (pieceSafe.length === 1) {
        if (!(await attemptMove(pieceUnSafe[0]))) return;
      }

      if (
        pieceSafe.length === 2 &&
        pieceSafe[0].position === pieceSafe[1].position
      ) {
        if (!(await attemptMove(pieceSafe[0]))) return;
      }

      if (pieceSafe.length === 2) {
        let scoreOfFirstPiece = pieceSafe[0].score;
        let opponentsBeforeFirstPiece = giveEnemiesBehindMe(pieceSafe[0]);

        let scoreOfSecondPiece = pieceSafe[1].score;
        let opponentsBeforeSecondPiece = giveEnemiesBehindMe(pieceSafe[1]);

        if (opponentsBeforeFirstPiece > opponentsBeforeSecondPiece) {
          if (!(await attemptMove(pieceSafe[1]))) return;
        } else if (opponentsBeforeSecondPiece > opponentsBeforeFirstPiece) {
          if (!(await attemptMove(pieceSafe[0]))) return;
        } else if (opponentsBeforeFirstPiece === opponentsBeforeSecondPiece) {
          if (scoreOfSecondPiece > scoreOfFirstPiece) {
            if (!(await attemptMove(pieceSafe[1]))) return;
          } else {
            if (!(await attemptMove(pieceSafe[0]))) return;
          }
        }
      }
    }

    // condition when the bot has 3 pieces unlocked
    if (totalUnlockedPieces.length === 3) {
      let pieceSafe = totalUnlockedPieces.filter((obj) =>
        safePaths.includes(obj.position)
      );
      let pieceUnSafe = totalUnlockedPieces.filter(
        (obj) => !safePaths.includes(obj.position)
      );

      if (pieceSafe.length === 0) {
        let scoreOfFirstPiece = pieceSafe[0].score;
        let scoreOfSecondPiece = pieceSafe[1].score;
        let scoreOfThirdPiece = pieceSafe[2].score;

        let greatestScore = Math.max(
          scoreOfFirstPiece,
          scoreOfSecondPiece,
          scoreOfThirdPiece
        );
        let movingPiece = pieceUnSafe.find(
          (obj) => obj.score === greatestScore
        );
        if (!(await attemptMove(movingPiece))) return;
      }

      if (pieceSafe.length === 1) {
        let scoreOfFirstPiece = pieceSafe[0].score;
        let scoreOfSecondPiece = pieceSafe[1].score;

        if (scoreOfSecondPiece > scoreOfFirstPiece) {
          if (!(await attemptMove(pieceUnSafe[1]))) return;
        } else {
          if (!(await attemptMove(pieceUnSafe[0]))) return;
        }
      }

      if (
        pieceSafe.length === 3 &&
        (pieceSafe[0].position === pieceSafe[1].position) ===
          pieceSafe[2].position
      ) {
        if (!(await attemptMove(pieceSafe[0]))) return;
      }

      if (pieceSafe.length === 2) {
        if (!(await attemptMove(pieceUnSafe[0]))) return;
      }

      if (pieceSafe.length === 3) {
        let opponentsBeforeFirstPiece = giveEnemiesBehindMe(pieceSafe[0]);
        let opponentsBeforeSecondPiece = giveEnemiesBehindMe(pieceSafe[1]);
        let opponentsBeforeThirdPiece = giveEnemiesBehindMe(pieceSafe[2]);

        if (
          opponentsBeforeFirstPiece < opponentsBeforeSecondPiece &&
          opponentsBeforeFirstPiece < opponentsBeforeThirdPiece
        ) {
          if (!(await attemptMove(pieceSafe[0]))) return;
        } else if (
          opponentsBeforeSecondPiece < opponentsBeforeFirstPiece &&
          opponentsBeforeSecondPiece < opponentsBeforeThirdPiece
        ) {
          if (!(await attemptMove(pieceSafe[1]))) return;
        } else if (
          opponentsBeforeThirdPiece < opponentsBeforeFirstPiece &&
          opponentsBeforeThirdPiece < opponentsBeforeSecondPiece
        ) {
          if (!(await attemptMove(pieceSafe[2]))) return;
        } else {
          let piecesAtHomePath = piece_team.filter(
            (obj) => obj.status === 1 && homePathArray.includes(obj.position)
          );
          let piecesNotAtHomePath = piece_team.filter(
            (obj) => obj.status === 1 && !homePathArray.includes(obj.position)
          );

          piecesNotAtHomePath.sort((a, b) => a.score - b.score);

          if (piecesNotAtHomePath.length > 0) {
            if (!(await attemptMove(piecesNotAtHomePath[0]))) return;
          } else {
            for (let i = 0; i < piecesAtHomePath; i++) {
              let movingPathArray = giveArrayForMovingPath(piecesAtHomePath[i])
              if (movingPathArray.length === diceResult) {
                isMoving = true
                moveMyPiece(piecesAtHomePath[i])
                break;
              }
            }
          }
        }
      }
    }
    if (!isMoving) {
      nextTeamTurn()
    }
  };

  const turnForUser = async (e) => {
    try {
      let isUserTurn = playerTurns[currentPlayerTurnIndex] === "red";
      let currentTeamTurn = playerTurns[currentPlayerTurnIndex];

      if (!isUserTurn || !currentPlayerTurnStatus) {
        return;
      }

      let totalUnlockedPieces = playerPieces.filter(
        (obj) => obj.team === currentTeamTurn && obj.status === 1
      ).length;

      let piece = playerPieces.find(
        (obj) =>
          obj.id === e.target.getAttribute("piece_id") &&
          obj.team === currentTeamTurn
      );
      if (!piece) {
        console.warn("Token not found for event target:", e.target);
        return;
      }

      // let array = giveArrayForMovingPath(piece);

      // if (array.length < diceResult) {
      //   return;
      // }

      // if (diceResult === 6) {
      //   currentPlayerTurnStatus = true;
      //   if (piece.status === 0) {
      //     piece.unlockPiece();
      //     return;
      //   }
      //   piece.movePiece(array);
      // } else {
      //   // if (piece.status === 0) {
      //   //   return;
      //   // }
      //   if (diceResult !== 6 && piece.status === 0) return;
      //   currentPlayerTurnStatus = true;
      //   piece.movePiece(array);
      //   if (!teamHasBonus) {
      //     nextTeamTurn();
      //   }
      // }

      if (diceResult === 6 && piece.status === 0) {
        piece.unlockPiece();
        return;
      }

      // Only move if piece is unlocked
      if (piece.status === 1) {
        let array = giveArrayForMovingPath(piece);

        if (array.length < diceResult) {
          return;
        }

        piece.movePiece(array);

        if (diceResult !== 6 && !teamHasBonus) {
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

  const rollDiceGif = new Image();
  rollDiceGif.src = "../../images/animated-dice-image-0040.gif";

  rollDiceBtn.addEventListener("click", async () => {
    diceResult = Math.floor(Math.random() * 6) + 1;
    if (!currentPlayerTurnStatus) return;

    // diceResult = 6;
    let currentTeamTurn = playerTurns[currentPlayerTurnIndex];

    rollDiceBtn.disabled = true;
    rollDice.src = rollDiceGif.src;
    // currentPlayerTurnStatus = false;
    // teamHasBonus = false;

    setTimeout(async () => {
      rollDice.src = `/images/dice_${diceResult}.png`;
      await delay(700);
      rollDiceBtn.disabled = false;

      currentPlayerTurnStatus = true;
      teamHasBonus = false;

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

      turnForBot();
    }, 600);
  };
});
