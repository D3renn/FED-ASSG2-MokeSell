const tiles = document.querySelectorAll(".tile");
const pointsDisplay = document.getElementById("points");
const livesDisplay = document.getElementById("lives");
const timerDisplay = document.getElementById("timer");

let points = 0;
let lives = 3;
let flippedTiles = [];
let matchedPairs = 0;

// Timer Logic
function startTimer(durationInHours) {
  let remainingTime = durationInHours * 60 * 60; // convert hours to seconds
  const timerInterval = setInterval(() => {
    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      timerDisplay.textContent = "Ready to play!";
      return;
    }

    const hours = Math.floor(remainingTime / 3600);
    const minutes = Math.floor((remainingTime % 3600) / 60);
    const seconds = remainingTime % 60;

    timerDisplay.textContent = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    remainingTime--;
  }, 1000);
}

// Flipping Logic
tiles.forEach((tile) => {
  tile.addEventListener("click", () => {
    if (tile.classList.contains("flipped") || flippedTiles.length === 2) return;

    tile.classList.add("flipped");
    flippedTiles.push(tile);

    if (flippedTiles.length === 2) {
      checkMatch();
    }
  });
});

function checkMatch() {
  const [tile1, tile2] = flippedTiles;

  if (tile1.dataset.pair === tile2.dataset.pair) {
    matchedPairs++;
    points += 50 - (flippedTiles.length - 1) * 20;
    flippedTiles = [];
  } else {
    lives--;
    setTimeout(() => {
      tile1.classList.remove("flipped");
      tile2.classList.remove("flipped");
      flippedTiles = [];
    }, 1000);
  }

  updateStats();
}

function updateStats() {
  pointsDisplay.textContent = points;
  livesDisplay.textContent = lives;

  if (lives === 0) {
    alert("Game Over!");
    resetGame();
  }

  if (matchedPairs === 8) {
    alert("Congratulations! You've matched all pairs!");
    resetGame();
  }
}

function resetGame() {
  lives = 3;
  points = 0;
  matchedPairs = 0;
  flippedTiles = [];
  tiles.forEach((tile) => tile.classList.remove("flipped"));
  updateStats();
}

// Initialize Game
startTimer(12);
updateStats();