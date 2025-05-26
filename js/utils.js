const vsComputer = document.querySelector(".vs-computer");
const selectPlayers = document.querySelector(".select-players");
const selectColors = document.querySelector(".select-colors");
const cancel = document.querySelector(".cancel-setup");
const blurOverlay = document.querySelector(".blur-overlay");

vsComputer.addEventListener("click", () => {
  selectPlayers.classList.add("show");
  blurOverlay.classList.add("show");
});

cancel.addEventListener("click", () => {
  selectPlayers.classList.remove("show");
  blurOverlay.classList.remove("show");
});

function handlePlayerCountSelection() {
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
