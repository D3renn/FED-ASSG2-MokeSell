import { checkUserLoggedIn } from "./utils.js";

const EMOJIS = ['🎮', '👾', '🕹️', '🎲', '🎯', '🎨', '🧩', '🎪'];
const gameBoard = document.getElementById('gameBoard');
const pointsDisplay = document.getElementById('points');
const livesDisplay = document.getElementById('lives');
const timerDisplay = document.getElementById('timer');

let flippedTiles = [];
let points = 0;
let lives = 10;
let gameActive = true;

// need to be logged in to play game
checkUserLoggedIn();

function initializeGame() {
    const lastPlayed = localStorage.getItem('lastPlayed');
    if (lastPlayed && Date.now() - lastPlayed < 43200000) { // 12 hours
        gameActive = false;
        updateTimer();
    }
    
    const emojis = [...EMOJIS, ...EMOJIS].sort(() => Math.random() - 0.5);
    gameBoard.innerHTML = '';
    
    emojis.forEach(emoji => {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.textContent = emoji;
        tile.dataset.emoji = emoji;
        tile.addEventListener('click', handleTileClick);
        gameBoard.appendChild(tile);
    });
}

function handleTileClick(e) {
    if (!gameActive || flippedTiles.length === 2 || e.target.classList.contains('flipped')) return;
    
    const tile = e.target;
    tile.classList.add('flipped');
    flippedTiles.push(tile);
    
    if (flippedTiles.length === 2) {
        setTimeout(checkMatch, 800);
    }
}

function checkMatch() {
    const [tile1, tile2] = flippedTiles;
    const match = tile1.dataset.emoji === tile2.dataset.emoji;
    
    if (match) {
        points += 100;
        tile1.classList.add('matched');
        tile2.classList.add('matched');
        checkWin();
    } else {
        lives--;
        tile1.classList.remove('flipped');
        tile2.classList.remove('flipped');
        if (lives === 0) handleGameEnd(false);
    }
    
    flippedTiles = [];
    updateDisplay();
}

function checkWin() {
    if (document.querySelectorAll('.matched').length === EMOJIS.length * 2) {
        handleGameEnd(true);
    }
}

function showAnimation() {
    const overlay = document.createElement('div');
    overlay.className = 'animation-overlay';
    overlay.innerHTML = `
        <dotlottie-player src="https://lottie.host/ad3b2cf2-5349-4f6e-83cc-99b882fab7de/MVP830YOHZ.lottie" background="transparent" speed="1" style="width: 300px; height: 300px" loop autoplay></dotlottie-player>
    `;
    document.body.appendChild(overlay);
    setTimeout(() => {
        document.body.removeChild(overlay);
    }, 3000); // Remove after 3 seconds
}

function handleGameEnd(won) {
    gameActive = false;
    localStorage.setItem('lastPlayed', Date.now());
    if (won) {
        console.log('Congratulations! You won!');
        points += lives * 50;
        showAnimation();
        setTimeout(() => {
            alert(`You won! Points: ${points}`);
            addPointsToUser(points);
        }, 3000); // Show alert after animation
    } else {
        alert(`Game Over! Points: ${points}`);
        addPointsToUser(points);
    }
    setTimeout(updateTimer, 1000);
}

function updateDisplay() {
    pointsDisplay.textContent = points;
    livesDisplay.textContent = lives;
}

function updateTimer() {
    const lastPlayed = localStorage.getItem('lastPlayed');
    if (!lastPlayed) return;
    
    const remainingTime = 43200000 - (Date.now() - lastPlayed);
    if (remainingTime > 0) {
        const hours = Math.floor(remainingTime / 3600000);
        const minutes = Math.floor((remainingTime % 3600000) / 60000);
        const seconds = Math.floor((remainingTime % 60000) / 1000);
        timerDisplay.textContent = `${hours}h ${minutes}m ${seconds}s`;
        setTimeout(updateTimer, 1000);
    } else {
        gameActive = true;
        timerDisplay.textContent = 'Ready!';
        initializeGame();
    }
}

function addPointsToUser(pointsToAdd) {
    const APIKEY = "67a717854d8744093c827ff3";
    const BASE_URL = "https://mokesell-209e.restdb.io/rest/accounts/";
    let loginId = localStorage.getItem("loginId");
    let gamepoints = +localStorage.getItem("gamepoints") || 0;

    fetch(BASE_URL + `${loginId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": APIKEY,
        },
        body: JSON.stringify({
            gamepoints: gamepoints + pointsToAdd,
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        if (data._id != undefined) {
            localStorage.setItem("gamepoints", gamepoints + pointsToAdd);
        } else {
            console.error("Error during game points update:", data);
        }
    })
    .catch((error) => {
        console.error("Error during game points update:", error);
    });
}

// Initialize the game
initializeGame();
updateDisplay();
if (!gameActive) updateTimer();