// importing all boards
window.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded");
  const green_house = document.getElementById("green-house");
  const blue_house = document.getElementById("blue-house");
  const yellow_house = document.getElementById("yellow-house");
  const red_house = document.getElementById("red-house");
  const rollDiceBtn = document.getElementById("roll-btn");
  const rollDice = document.getElementById("diceImg");
  const roll = new Audio(
    "../../assets/sound/mixkit-video-game-blood-pop-2361.wav"
  );

  const move = new Audio("../../assets/sound/mixkit-game-ball-tap-2073.wav");
  const unlock = new Audio(
    "../../assets/sound/mixkit-martial-arts-fast-punch-2047.wav"
  );
  // console.log(red_house);

  //Initial variables
  let playerTurns = [];
  let currentPlayerTurnIndex = 0;
  let prevPlayerTurnIndex;
  let currentPlayerTurnStatus = true;
  let teamHasBonus = false;
  let allTokens = [];
  let isPaused = false;

  let diceResult;

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
    red: ["rh1", "rh2", "rh3", "rh4", "rh5", "home"],
    blue: ["bh1", "bh2", "bh3", "bh4", "bh5", "home"],
    green: ["gh1", "gh2", "gh3", "gh4", "gh5", "home"],
    yellow: ["yh1", "yh2", "yh3", "yh4", "yh5", "home"],
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
      this.homePathEntry = homePathEntry;
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
      unlock.play();
    }

    updatePosition(position) {
      this.position = position;
    }

    movePiece(array) {
      let fullMovePath = [...array];
      const mainPathLength = 50;
      const lastHomePos = homePathEntries[this.team].at(-1);

      // CASE 1: Already inside the home path
      if (homePathEntries[this.team].includes(this.position)) {
        const currentIndex = homePathEntries[this.team].indexOf(this.position);
        const nextSteps = homePathEntries[this.team].slice(
          currentIndex + 1,
          currentIndex + 1 + diceResult
        );

        // Check if reaching the end (home)
        if (nextSteps.at(-1) === lastHomePos || nextSteps.at(-1) === "home") {
          teamHasBonus = true;
        }

        tokenToMove(this.id, nextSteps);
        this.position = nextSteps.at(-1);
        this.score += nextSteps.length;
        return;
      }

      // CASE 2: Still on main path (your existing logic)
      let stepsOnMain = fullMovePath.filter((pos) =>
        pathArray.includes(pos)
      ).length;
      const willEnterHome = this.stepsMoved + stepsOnMain >= mainPathLength;

      if (willEnterHome) {
        let stepsToHomeEntry = mainPathLength - this.stepsMoved;
        let mainPathSegment = fullMovePath.slice(0, stepsToHomeEntry);
        let remainingSteps = diceResult - mainPathSegment.length;

        //  Ensure the full 6-step home path can be entered
        let homePath = homePathEntries[this.team];
        let homeSegment = homePath.slice(0, remainingSteps);

        fullMovePath = mainPathSegment.concat(homeSegment);
      }

      const finalPos = fullMovePath.at(-1);
      if (
        finalPos === "home" ||
        finalPos === homePathEntries[this.team].at(-1)
      ) {
        teamHasBonus = true;

        // Hide the token or mark as complete
        const tokenEl = document.querySelector(`[piece_id="${this.id}"]`);
        tokenEl.style.display = "none";
        this.status = 2; // status = 2 means 'finished'
      }

      tokenToMove(this.id, fullMovePath);
      let movedOnMain = fullMovePath.filter((pos) =>
        pathArray.includes(pos)
      ).length;
      this.stepsMoved += movedOnMain;
      this.position = finalPos;
      this.score += fullMovePath.length;
      console.log("Checking win for team:", this.team);
      console.log("All tokens:", allTokens);
    }

    // function to return the piece to the locked position when killed
    sentMeToBoard() {
      this.score = 0;
      this.position = this.initailPosition;
      this.status = 0;
      let element = document.querySelector(`[piece_id="${this.id}"]`);
      let toAppendDiv = document.getElementById(this.initailPosition);
      toAppendDiv.appendChild(element);
    }
  }

  const boardDetails = [
    {
      boardColor: "red",
      board: red_house,
      homePathEntry: "r13",
      gameEntry: "r1",
    },
    {
      boardColor: "green",
      board: green_house,
      homePathEntry: "g13",
      gameEntry: "g1",
    },
    {
      boardColor: "blue",
      board: blue_house,
      homePathEntry: "b13",
      gameEntry: "b1",
    },

    {
      boardColor: "yellow",
      board: yellow_house,
      homePathEntry: "y13",
      gameEntry: "y1",
    },
  ];

  const numberOfPlayers = parseInt(localStorage.getItem("numberOfPlayers"));
  const playerColor = localStorage.getItem("playerColor");

  let colorsToUse = [];

  if (numberOfPlayers === 2) {
    if (playerColor === "red" || playerColor === "green") {
      colorsToUse = ["red", "green"];
    } else if (playerColor === "blue" || playerColor === "yellow") {
      colorsToUse = ["yellow", "blue"];
    }
  } else {
    colorsToUse = ["red", "blue", "green", "yellow"];
  }
  playerTurns = [...colorsToUse];

  let playerPieces = [];

  colorsToUse.forEach((color) => {
    const boardObj = boardDetails.find((b) => b.boardColor === color);
    const boardColor = boardObj.boardColor;
    const homePathEntry = boardObj.homePathEntry;
    const gameEntry = boardObj.gameEntry;

    const parentDiv = document.createElement("div");
    parentDiv.classList.add("board");

    for (let i = 0; i < 4; i++) {
      const span = document.createElement("span");
      const icon = document.createElement("i");
      icon.classList.add(
        "fa-duotone",
        "fa-solid",
        "fa-location-dot",
        "piece",
        `${boardColor}-piece`
      );

      let pieceID = `${boardColor}${i}`;
      let position = `${i}_${boardColor}`;

      span.setAttribute("id", position);
      icon.setAttribute("piece_id", pieceID);

      icon.addEventListener("click", (e) => {
        turnForUser(e);
      });

      if (boardColor === playerColor) {
        icon.setAttribute("myPieceNum", i + 1);
      }

      const player = new Token(
        boardColor,
        position,
        0,
        homePathEntry,
        pieceID,
        gameEntry
      );
      playerPieces.push(player);
      span.append(icon);
      parentDiv.append(span);
      allTokens.push(player);
    }

    boardObj.board.append(parentDiv);
  });


  currentPlayerTurnIndex = playerTurns.indexOf(playerColor);
  console.log(currentPlayerTurnIndex);

  if (currentPlayerTurnIndex === -1) {
    // If playerColor is not found, default to 0
    currentPlayerTurnIndex = 0;
  }

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

  setPlayerTurn(currentPlayerTurnIndex);

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
    if (playerTurns[currentPlayerTurnIndex] !== playerColor) {
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

        let totalPiecesOfTeam = playerPieces.filter(
          (obj) => obj.team === currentTeamTurn
        );
        if (totalPiecesOfTeam.length === 0) {
          declareWinner(currentTeamTurn);
        }
        if (currentTeamTurn === playerColor) {
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
        move.play();
        moveToNextTarget(index + 1);
      }, 200);
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
      if (playerTurns[currentPlayerTurnIndex] !== playerColor) rollDiceForBot();
    }
  };

  const moveMyPiece = async (piece) => {
    let array = giveArrayForMovingPath(piece);
    if (array.length < diceResult) {
      await delay(500);
      currentPlayerTurnStatus = true;
      nextTeamTurn();
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

    for (let i = 1; i <= 6; i++) {
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
    if (isPaused) return;
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
    let opponentPieces = playerPieces.filter(
      (obj) => obj.team !== currentTeamTurn && obj.status === 1
    );
    let bonusReached = false;

    for (let i = 0; i < totalUnlockedPieces.length; i++) {
      if (bonusReached) {
        break;
      }

      let array = giveArrayForMovingPath(totalUnlockedPieces[i]);
      let cut = opponentPieces.find(
        (obj) =>
          obj.position === array[array.length - 1] &&
          !safePaths.includes(obj.position)
      );
      let homeBonusReached = array[array.length - 1] === "home";
      if (cut) {
        totalUnlockedPieces[i].movePiece(array);
        await delay(array.length * 175);
        cut.sentMeToBoard();
        bonusReached = true;
        rollMyDice(true);
        return;
      }
      if (homeBonusReached) {
        totalUnlockedPieces[i].movePiece(array);
        await delay(array.length * 175);
        bonusReached = true;
        rollMyDice(true);
      }
    }

    if (bonusReached) {
      return;
    }

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
        totalUnlockedPieces.length <= 3 &&
        diceResult === 6 &&
        totalPiecesOfTheTeam >= 3
      ) {
        lockedPieces[0].unlockPiece();
        rollDiceForBot();
        return;
      }
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

      if (pieceSafe.length === 0 && pieceUnSafe.length === 4) {
        let scores = pieceUnSafe.map((p) => p.score);
        let greatestScore = Math.max(...scores);
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
              let movingPathArray = giveArrayForMovingPath(piecesAtHomePath[i]);
              if (movingPathArray.length === diceResult) {
                isMoving = true;
                moveMyPiece(piecesAtHomePath[i]);
                break;
              }
            }
          }
        }
      }
    }
    if (!isMoving) {
      nextTeamTurn();
    }
  };

  const turnForUser = async (e) => {
      if (isPaused) return;
    try {
      let isUserTurn = playerTurns[currentPlayerTurnIndex] === playerColor;
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
      let opponentPieces = playerPieces.filter(
        (obj) => obj.team !== currentTeamTurn && obj.status === 1
      );
      let array = giveArrayForMovingPath(piece);

      let cut = opponentPieces.find(
        (obj) =>
          obj.position === array[array.length - 1] &&
          !safePaths.includes(obj.position)
      );
      if (cut) {
        piece.movePiece(array);
        await delay(array.length * 175);
        cut.sentMeToBoard();
        currentPlayerTurnStatus = true;
        return;
      }

      if (!piece) {
        console.warn("Token not found for event target:", e.target);
        return;
      }

      if (diceResult === 6 && piece.status === 0) {
        piece.unlockPiece();
        return;
      }

      // Only move if piece is unlocked
      if (piece.status === 1) {
        let array = giveArrayForMovingPath(piece);

        if (array.length < diceResult) {
          await delay(500);
          currentPlayerTurnStatus = true;
          nextTeamTurn();
          return;
        }

        piece.movePiece(array);

        if (diceResult !== 6 && !teamHasBonus) {
          nextTeamTurn();
        }
      }
    } catch (err) {
      console.error("Error in turnForUser:", err);
    }
  };

  const rollDiceGif = new Image();
  rollDiceGif.src = "../../assets/images/animated-dice-image-0040.gif";

  rollDiceBtn.addEventListener("click", async () => {
    roll.play();
    diceResult = Math.floor(Math.random() * 6) + 1;
    if (!currentPlayerTurnStatus) return;

    // diceResult = 6;
    let currentTeamTurn = playerTurns[currentPlayerTurnIndex];

    rollDiceBtn.disabled = true;
    rollDice.src = rollDiceGif.src;
    // currentPlayerTurnStatus = false;
    // teamHasBonus = false;

    setTimeout(async () => {
      rollDice.src = `../../assets/images/dice_${diceResult}.png`;
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
    roll.play();
    if (isPaused) return;
    if (!currentPlayerTurnStatus) return;

    rollDice.src = rollDiceGif.src;
    diceResult = Math.floor(Math.random() * 6) + 1;
    currentPlayerTurnStatus = false;
    teamHasBonus = false;

    setTimeout(async () => {
      rollDice.src = `../../assets/images/dice_${diceResult}.png`;
      await delay(700);
      rollDiceBtn.disabled = false;

      turnForBot();
    }, 600);
  };
});
document.addEventListener("keydown", (e) => {
  let currentTeamTurn = playerTurns[currentPlayerTurnIndex];

  if (currentTeamTurn !== playerColor) {
    return;
  }

  if (e.key === 1) {
    let piece = document.querySelector(`[myPieceNum="1"]`);
    piece?.click();
  }
  if (e.key === 2) {
    let piece = document.querySelector(`[myPieceNum="2"]`);
    piece?.click();
  }
  if (e.key === 3) {
    let piece = document.querySelector(`[myPieceNum="3"]`);
    piece?.click();
  }
  if (e.key === 4) {
    let piece = document.querySelector(`[myPieceNum="4"]`);
    piece?.click();
  }
  if (e.key === " " || e.code === "Space") {
    rollDiceBtn.click();
  }
});

const click = new Audio(
  "../../assets/sound/mixkit-revolver-chamber-spin-1674.wav"
);
const lightClick = new Audio(
  "../../assets/sound/mixkit-lighter-wheel-spin-2641.wav"
);
const winPlay = new Audio(
  "../../assets/sound/mixkit-cheering-crowd-loud-whistle-610 (1).wav"
);

let declareWinner = (team) => {
  winPlay.play()
  let parentDiv = document.createElement("div");
  let childDiv = document.createElement("div");
  let h1 = document.createElement("h1");
  let button = document.createElement("button");

  parentDiv.setAttribute("id", "winner");
  h1.textContent = `${team} Won The Game`;

  button.textContent = "🔁 Play Again";
  button.addEventListener("click", () => {
    location.reload();
    winPlay.pause()
  });
  childDiv.append(h1);
  childDiv.append(button);
  parentDiv.append(childDiv);
  document.body.append(parentDiv);
};
function toggleMenu() {
  const menu = document.getElementById("sidebar");
  const blurOverlay = document.querySelector(".blur-overlay");
  menu.classList.toggle("open-sidebar");
  blurOverlay.classList.toggle("show");
  isPaused = true;
  click.play()
}
function resumeGame() {
  const menu = document.getElementById("sidebar");
  const blurOverlay = document.querySelector(".blur-overlay");
  menu.classList.toggle("open-sidebar");
  blurOverlay.classList.toggle("show");
  isPaused = false
  lightClick.play()
}
function restartGame() {
  location.reload();
  lightClick.play()
}
function goToMainMenu() {
  localStorage.clear();
  window.location.href = "/game-setup.html";
  lightClick.play()
}