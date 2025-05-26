const vsComputer = document.querySelector(".vs-computer");
const selectPlayers = document.querySelector(".select-players");
const cancel = document.querySelector(".cancel-setup");
const isTwoPlayers = document.getElementById("twoPlayers").checked;
const isFourPlayers = document.getElementById("fourPlayers").checked;

vsComputer.addEventListener("click", () => {
  selectPlayers.classList.add("show");
});

cancel.addEventListener("click", () => {
  selectPlayers.classList.remove("show");
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

  // Redirect to game
  window.location.href = "/play.html";
}
