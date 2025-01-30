const tiles = document.querySelectorAll(".tile");
const pointsDisplay = document.getElementById("points");
const livesDisplay = document.getElementById("lives");
const timerDisplay = document.getElementById("timer");

let points = 0;
let lives = 3;
let flippedTiles = [];
let matchedPairs = 0;

import { checkUserLoggedIn } from './utils.js';

// need to be logged in to play game
checkUserLoggedIn();

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
      setTimeout(checkMatch, 2000); // Wait 3 seconds before checking match
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

function addPointsToUser(pointsToAdd){
  const APIKEY = "678a13b229bb6d4dd6c56bd2";
  const BASE_URL = "https://mokesell-2304.restdb.io/rest/accounts/";
  let loginId = localStorage.getItem("loginId");
  let gamepoints = +localStorage.getItem("gamepoints"); // + sign convert string to number.
  fetch(BASE_URL + `${loginId}`, {
    method: "PATCH",
    headers: {
        "Content-Type": "application/json",
        "x-apikey": APIKEY,
    },
    body:  JSON.stringify({
      "gamepoints":gamepoints+pointsToAdd
    })
})
    .then((response) => response.json())
    .then((data) => {
      if(data._id != undefined){
        localStorage.setItem("gamepoints", gamepoints+pointsToAdd); 
      }
      else{
        console.error("Error during game points update:", data);
      }  
    })
    .catch((error) => {
        console.error("Error during game points update:", error);
    });
}

function updateStats() {
  pointsDisplay.textContent = points;
  livesDisplay.textContent = lives;
  
  if (lives === 0) {
    addPointsToUser(points); // update points when lose
    alert("Game Over!");
    resetGame();
  }

  if (matchedPairs === 8) {
    addPointsToUser(points); // update points when win
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
resetGame();
updateStats();

function fetchLeaderboard() {
  const APIKEY = "678a13b229bb6d4dd6c56bd2";
  const BASE_URL = "https://mokesell-2304.restdb.io/rest/accounts/";

  fetch(BASE_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-apikey": APIKEY,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Sort users by gamepoints in descending order
      const sortedUsers = data.sort((a, b) => b.gamepoints - a.gamepoints);
      const top3Users = sortedUsers.slice(0, 3); // Get top 3 users

      // Display the top 3 users in the leaderboard
      const leaderboardList = document.getElementById("leaderboard-list");
      leaderboardList.innerHTML = top3Users
        .map(
          (user, index) => `
        <li>
          <span>${index + 1}. ${user.username || "Anonymous"}</span>
          <span>${user.gamepoints || 0} points</span>
        </li>
      `
        )
        .join("");
    })
    .catch((error) => {
      console.error("Error fetching leaderboard:", error);
    });
}

// Call fetchLeaderboard when the game initializes
fetchLeaderboard();