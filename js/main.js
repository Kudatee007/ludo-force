let progress = document.querySelector(".progress");
let text = document.querySelector(".text");
let playBtn = document.querySelector(".play-now-btn");
let loader = document.querySelector(".loading");
const unlock = new Audio("../assets/sound/mixkit-game-level-music-689.wav");

const win = document.getElementById("win");

let count = 4;
let per = 16;

// loader animation
function animate() {
  if (count == 70) {
    text.style.display = "block";
  }

  if (count >= 100) {
    text.style.display = "block";
    clearInterval(loading);
  } else {
    per = per + 4;
    count = count + 1;
    progress.style.width = count + "%";
  }
}

playBtn.addEventListener("click", () => {
  loader.style.display = "block";
  playBtn.style.display = "none";
  unlock.play();
  loading = setInterval(animate, 50);
  setTimeout(() => {
    window.location.href = "game-setup.html";
  }, 5000);
});
