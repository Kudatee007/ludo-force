const gameState = {
  playerTurns: [],
  currentPlayerTurnIndex: 0,
  prevPlayerTurnIndex: null,
  currentPlayerTurnStatus: true,
  teamHasBonus: false,
  allTokens: [],
  isPaused: false,
  diceResult: null,
  winner: null,
  isGameOver: false,
};

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

  const stateToSave = {
    gameState,
    allTokens: gameState.allTokens.map((token) => ({
      team: token.team,
      position: token.position,
      score: token.score,
      homePathEntry: token.homePathEntry,
      id: token.id,
      gameEntry: token.gameEntry,
      status: token.status,
      initailPosition: token.initailPosition,
      stepsMoved: token.stepsMoved,
    })),
  };

  localStorage.setItem("ludoGameState", JSON.stringify(stateToSave));

  // path array movement for token/piece
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

  // home-path token/piece
  let homePathEntries = {
    red: ["rh1", "rh2", "rh3", "rh4", "rh5", "home"],
    blue: ["bh1", "bh2", "bh3", "bh4", "bh5", "home"],
    green: ["gh1", "gh2", "gh3", "gh4", "gh5", "home"],
    yellow: ["yh1", "yh2", "yh3", "yh4", "yh5", "home"],
  };

  let homePathArray = [
    ...homePathEntries.red,
    ...homePathEntries.blue,
    ...homePathEntries.green,
    ...homePathEntries.yellow,
  ];

  // safe-path movement for token/piece
  let safePaths = [
    ...homePathEntries.red,
    ...homePathEntries.blue,
    ...homePathEntries.green,
    ...homePathEntries.yellow,
  ];

  /**
   * Class representing a Ludo game token (piece).
   */

  class Token {
    /**
     * Create a token.
     * @param {string} team - The team the token belongs to (e.g., "red", "blue").
     * @param {string} position - The current position ID of the token.
     * @param {number} score - The current score of the token.
     * @param {string} homePathEntry - The entry point to the team's home path.
     * @param {string} PlayerId - The unique ID assigned to this token (used in the DOM).
     * @param {string} gameEntry - The main path entry point for the team.
     */
    constructor(team, position, score, homePathEntry, PlayerId, gameEntry) {
      // ... constructor logic
      this.team = team;
      this.position = position;
      this.score = score;
      this.homePathEntry = homePathEntry;
      this.id = PlayerId;
      this.gameEntry = gameEntry;
      this.status = 0;

      this.initailPosition = position;
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
          currentIndex + 1 + gameState.diceResult
        );

        // Check if reaching the end (home)
        if (nextSteps.at(-1) === lastHomePos || nextSteps.at(-1) === "home") {
          gameState.teamHasBonus = true;
        }

        tokenToMove(this.id, nextSteps);
        updateOverlapCounts();
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
        let remainingSteps = gameState.diceResult - mainPathSegment.length;

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
        gameState.teamHasBonus = true;

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
    }

    /**
     * Sends the token back to its base when knocked out.
     * Resets score and position.
     */
    sentMeToBoard() {
      this.score = 0;
      this.position = this.initailPosition;
      this.status = 0;
      let element = document.querySelector(`[piece_id="${this.id}"]`);
      let toAppendDiv = document.getElementById(this.initailPosition);
      toAppendDiv.appendChild(element);
    }
  }

  const untilUnpaused = () =>
    new Promise((resolve) => {
      const check = () => {
        if (!gameState.isPaused) return resolve();
        setTimeout(check, 200); // recheck every 200ms
      };
      check();
    });

    const updateOverlapCounts =()=> {
      // First clear all existing counts and text on pieces
      document.querySelectorAll(".piece").forEach((icon) => {
        icon.removeAttribute("data-overlap-count");
        icon.textContent = "";
      });
  
      const piecesOnCell = playerPieces.filter(
        (piece) => piece.position === position
      );
      const count = piecesOnCell.length;
      console.log(count);
      
      if (count > 1) {
        icon.setAttribute("data-overlap-count", count);
        icon.textContent = count; // Show the count on the icon
      } else {
        icon.removeAttribute("data-overlap-count");
        icon.textContent = ""; // clear text if only 1 piece
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

  // condition for player number selection
  if (numberOfPlayers === 2) {
    if (playerColor === "red" || playerColor === "green") {
      colorsToUse = ["red", "green"];
    } else if (playerColor === "blue" || playerColor === "yellow") {
      colorsToUse = ["yellow", "blue"];
    }
  } else {
    colorsToUse = ["red", "blue", "green", "yellow"];
  }
  gameState.playerTurns = [...colorsToUse];
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
      // allTokens.push(player);
    }

    boardObj.board.append(parentDiv);
  });

  gameState.currentPlayerTurnIndex = gameState.playerTurns.indexOf(playerColor);

  if (gameState.currentPlayerTurnIndex === -1) {
    // If playerColor is not found, default to 0
    gameState.currentPlayerTurnIndex = 0;
  }

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const setPlayerTurn = (playerTurnIndex) => {
    if (playerTurnIndex === null || playerTurnIndex === undefined) {
      return;
    }

    let currentTeamTurn = gameState.playerTurns[playerTurnIndex];
    // filtering the board details arrays and finding the currentTeam
    let boardDetailObject = boardDetails.filter(
      (obj) => obj.boardColor === currentTeamTurn
    );
    boardDetailObject[0].board.classList.toggle("active");
  };

  setPlayerTurn(gameState.currentPlayerTurnIndex);

  const nextTeamTurn = async () => {
    // await untilUnpaused();
    gameState.prevPlayerTurnIndex = gameState.currentPlayerTurnIndex;

    if (gameState.currentPlayerTurnIndex === gameState.playerTurns.length - 1) {
      gameState.currentPlayerTurnIndex = 0;
    } else {
      gameState.currentPlayerTurnIndex += 1;
    }

    setPlayerTurn(gameState.prevPlayerTurnIndex);
    setPlayerTurn(gameState.currentPlayerTurnIndex);

    await delay(500);
    if (
      gameState.playerTurns[gameState.currentPlayerTurnIndex] !== playerColor
    ) {
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

      for (let i = 0; i < gameState.diceResult; i++) {
        if (indexOfPath + 1 < homePathArrayForPiece.length) {
          indexOfPath += 1;
          movingArray.push(homePathArrayForPiece[indexOfPath]);
        } else {
          break; // exit the loop if the end of the home path array is reached
        }
      }
    } else {
      indexOfPath = pathArray.findIndex((elem) => elem === piece.position);

      for (let i = 0; i < gameState.diceResult; i++) {
        indexOfPath = (indexOfPath + 1) % pathArray.length;
        movingArray.push(pathArray[indexOfPath]);
      }
    }
    return movingArray;
  };

  const tokenToMove = (tokenId, array) => {
    const tokenToMove = document.querySelector(`[piece_id="${tokenId}"]`);
    let currentTeamTurn =
      gameState.playerTurns[gameState.currentPlayerTurnIndex];
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
          gameState.winner = currentTeamTurn;
          gameState.isGameOver = true;
          declareWinner(currentTeamTurn);
        }
        if (currentTeamTurn === playerColor) {
          gameState.currentPlayerTurnStatus = true;
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
    await untilUnpaused();
    // if (gameState.isPaused) return;
    gameState.currentPlayerTurnStatus = true;
    await delay(700);
    if (gameState.diceResult === 6 || hasBonus || gameState.teamHasBonus) {
      rollDiceForBot();
    } else {
      nextTeamTurn();
      if (
        gameState.playerTurns[gameState.currentPlayerTurnIndex] !== playerColor
      )
        rollDiceForBot();
    }
  };

  const moveMyPiece = async (piece) => {
    await untilUnpaused();
    let array = giveArrayForMovingPath(piece);
    if (array.length < gameState.diceResult) {
      await delay(500);
      gameState.currentPlayerTurnStatus = true;
      nextTeamTurn();
      return false;
    }

    piece.movePiece(array);
    await delay(array.length * 175);
    rollMyDice();
    return true;
  };

  const giveEnemiesBehindMe = async () => {
    let currentTeamTurn =
      gameState.playerTurns[gameState.currentPlayerTurnIndex];
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
    let currentTeamTurn =
      gameState.playerTurns[gameState.currentPlayerTurnIndex];
    let totalUnlockedPieces = playerPieces.filter(
      (obj) => obj.team === currentTeamTurn && obj.status === 1
    );
    let totalPiecesOfTheTeam = playerPieces.filter(
      (obj) => obj.team === currentTeamTurn
    ).length;
    let isMoving = false;

    if (totalUnlockedPieces.length === 0 && gameState.diceResult !== 6) {
      rollMyDice();
      return;
    }

    gameState.currentPlayerTurnStatus = true;
    let piece_team = playerPieces.filter((obj) => obj.team === currentTeamTurn);
    // condition when bot has 0 pieces unlocked
    if (totalUnlockedPieces.length === 0 && gameState.diceResult === 6) {
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
      if (totalUnlockedPieces.length <= 3 && gameState.diceResult === 6) {
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
        gameState.diceResult === 6 &&
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

      if (pieceSafe.length === 1 && pieceUnSafe.length >= 1) {
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

      if (pieceSafe.length === 0 && pieceUnSafe.length === 3) {
        let scores = pieceUnSafe.map((p) => p.score);
        let greatestScore = Math.max(...scores);
        let movingPiece = pieceUnSafe.find(
          (obj) => obj.score === greatestScore
        );
        if (!(await attemptMove(movingPiece))) return;
      }

      if (pieceSafe.length === 1 && pieceUnSafe.length > 0) {
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
            for (let i = 0; i < piecesAtHomePath.length; i++) {
              let movingPathArray = giveArrayForMovingPath(piecesAtHomePath[i]);
              if (movingPathArray.length === gameState.diceResult) {
                isMoving = true;
                await moveMyPiece(piecesAtHomePath[i]);
                break;
              }
            }
          }
        }
      }
    }
    if (!isMoving) {
      const validPiece = totalUnlockedPieces.find(piece => {
        const path = giveArrayForMovingPath(piece);
        return path.length === gameState.diceResult;
      });
    
      if (validPiece) {
        await attemptMove(validPiece);
        return;
      }
    }
    
  };

  const turnForUser = async (e) => {
    try {
      let isUserTurn =
        gameState.playerTurns[gameState.currentPlayerTurnIndex] === playerColor;
      let currentTeamTurn =
        gameState.playerTurns[gameState.currentPlayerTurnIndex];

      if (!isUserTurn || !gameState.currentPlayerTurnStatus) {
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
        gameState.currentPlayerTurnStatus = true;
        return;
      }

      if (!piece) {
        console.warn("Token not found for event target:", e.target);
        return;
      }

      if (gameState.diceResult === 6 && piece.status === 0) {
        piece.unlockPiece();
        return;
      }

      // Only move if piece is unlocked
      if (piece.status === 1) {
        let array = giveArrayForMovingPath(piece);

        if (array.length < gameState.diceResult) {
          await delay(500);
          gameState.currentPlayerTurnStatus = true;
          nextTeamTurn();
          return;
        }

        piece.movePiece(array);

        if (gameState.diceResult !== 6 && !gameState.teamHasBonus) {
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
    gameState.diceResult = Math.floor(Math.random() * 6) + 1;
    if (!gameState.currentPlayerTurnStatus) return;

    let currentTeamTurn =
      gameState.playerTurns[gameState.currentPlayerTurnIndex];

    rollDiceBtn.disabled = true;
    rollDice.src = rollDiceGif.src;

    setTimeout(async () => {
      rollDice.src = `../../assets/images/dice_${gameState.diceResult}.png`;
      await delay(700);
      rollDiceBtn.disabled = false;

      gameState.currentPlayerTurnStatus = true;
      gameState.teamHasBonus = false;

      let totalUnlockedPieces = playerPieces.filter(
        (obj) => obj.team === currentTeamTurn && obj.status === 1
      );

      if (
        totalUnlockedPieces.length === 0 &&
        gameState.diceResult !== 6 &&
        !gameState.teamHasBonus
      ) {
        await delay(500);
        gameState.currentPlayerTurnStatus = true;
        nextTeamTurn();
      }
    }, 600);
  });

  const rollDiceForBot = () => {
    roll.play();
    if (!gameState.currentPlayerTurnStatus) return;

    rollDice.src = rollDiceGif.src;
    gameState.diceResult = Math.floor(Math.random() * 6) + 1;
    gameState.currentPlayerTurnStatus = false;
    gameState.teamHasBonus = false;

    setTimeout(async () => {
      rollDice.src = `../../assets/images/dice_${gameState.diceResult}.png`;
      await delay(700);
      rollDiceBtn.disabled = false;

      turnForBot();
    }, 600);
  };
  document.body.addEventListener("keydown", (e) => {
    let currentTeamTurn =
      gameState.playerTurns[gameState.currentPlayerTurnIndex];

    // Ensure only the current player can interact
    if (currentTeamTurn !== playerColor) return;

    // Prevent default behavior (space scrolling etc.)
    if ([" ", "Space", "1", "2", "3", "4"].includes(e.key)) {
      e.preventDefault();
    }

    // Handle piece selection
    if (["1", "2", "3", "4"].includes(e.key)) {
      const piece = document.querySelector(`[myPieceNum="${e.key}"]`);
      piece?.click();
    }

    // Handle dice roll on spacebar
    if (e.key === " " || e.code === "Space") {
      rollDiceBtn?.click();
    }
  });

  console.log(gameState);
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

// winner declaration
let declareWinner = (team) => {
  winPlay.play();
  let parentDiv = document.createElement("div");
  let childDiv = document.createElement("div");
  let h1 = document.createElement("h1");
  let button = document.createElement("button");

  parentDiv.setAttribute("id", "winner");
  h1.textContent = `${team} Won The Game`;

  button.textContent = "🔁 Play Again";
  button.addEventListener("click", () => {
    location.reload();
    winPlay.pause();
  });
  childDiv.append(h1);
  childDiv.append(button);
  parentDiv.append(childDiv);
  document.body.append(parentDiv);
};
function pauseGame() {
  const menu = document.getElementById("sidebar");
  const blurOverlay = document.querySelector(".blur-overlay");
  menu.classList.add("open-sidebar");
  blurOverlay.classList.add("show");
  gameState.isPaused = true;
  click.play();
}

function resumeGame() {
  gameState.isPaused = false;
  const menu = document.getElementById("sidebar");
  const blurOverlay = document.querySelector(".blur-overlay");
  const instructions = document.getElementById("instructions");
  menu.classList.remove("open-sidebar");
  blurOverlay.classList.remove("show");
  instructions.classList.remove("show");
  lightClick.play();
}

function restartGame() {
  location.reload();
  lightClick.play();
}
function goToMainMenu() {
  localStorage.clear();
  window.location.href = "/game-setup.html";
  lightClick.play();
}
function showInstructions() {
  const instructions = document.getElementById("instructions");
  instructions.classList.toggle("show");
  lightClick.play();
}
function closeInstructions() {
  const instructions = document.getElementById("instructions");
  instructions.classList.remove("show");
  lightClick.play();
}
