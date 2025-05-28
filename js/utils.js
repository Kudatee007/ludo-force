const vsComputer = document.querySelector(".vs-computer");
const selectPlayers = document.querySelector(".select-players");
const selectColors = document.querySelector(".select-colors");
const cancel = document.querySelectorAll(".cancel-setup");
const blurOverlay = document.querySelector(".blur-overlay");
const players = document.querySelectorAll(".players");
const selColor = document.querySelectorAll(".color-box");

const click = new Audio(
  "../assets/sound/mixkit-revolver-chamber-spin-1674.wav"
);
const lightClick = new Audio(
  "../assets/sound/mixkit-lighter-wheel-spin-2641.wav"
);

vsComputer.addEventListener("click", () => {
  selectPlayers.classList.add("show");
  blurOverlay.classList.add("show");
  click.play();
});

players.forEach((player) => {
  player.addEventListener("click", () => {
    lightClick.play();
  });
});

selColor.forEach((color) => {
  color.addEventListener("click", () => {
    lightClick.play();
  });
});

cancel.forEach((can) => {
  can.addEventListener("click", () => {
    lightClick.play();
    selectPlayers.classList.remove("show");
    blurOverlay.classList.remove("show");
  });
});

function handlePlayerCountSelection() {
  click.play();
  const isTwoPlayers = document.getElementById("twoPlayers").checked;
  const isFourPlayers = document.getElementById("fourPlayers").checked;

  let playerCount = 0;

  if (isTwoPlayers) {
    playerCount = 2;
  } else if (isFourPlayers) {
    playerCount = 4;
  } else {
    alert("Please select number of players.");
    return;
  }

  // Save to localStorage
  localStorage.setItem("numberOfPlayers", playerCount);

  selectPlayers.classList.remove("show");
  selectColors.classList.add("show");
}

function handlePlayerColor() {
  click.play();
  const redColor = document.getElementById("red-color").checked;
  const greenColor = document.getElementById("green-color").checked;
  const blueColor = document.getElementById("blue-color").checked;
  const yellowColor = document.getElementById("yellow-color").checked;

  let playerColor;

  if (redColor) {
    playerColor = "red";
  } else if (greenColor) {
    playerColor = "green";
  } else if (blueColor) {
    playerColor = "blue";
  } else if (yellowColor) {
    playerColor = "yellow";
  } else {
    alert("Please select number of players.");
    return;
  }

  localStorage.setItem("playerColor", playerColor);
  // Redirect to game
  window.location.href = "/play.html";
}
