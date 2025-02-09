import { checkUserLoggedIn } from './utils.js';

// Need to be logged in to view profile
checkUserLoggedIn();

// Store the user ID in localStorage
let username = localStorage.getItem("username"); 
let gamepoints = localStorage.getItem("gamepoints"); 
const APIKEY = "678a13b229bb6d4dd6c56bd2";
const ACCOUNTS_URL = "https://mokesell-2304.restdb.io/rest/accounts";
const loginId = localStorage.getItem("loginId");

// Get the elements where the user data will be displayed
let usernameDisplay = document.getElementById("usernameDisplay");
let gamepointsDisplay = document.getElementById("gamepointsDisplay");

// Fetch and update profile information
function fetchProfile() {
    fetch(`${ACCOUNTS_URL}/${loginId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": APIKEY,
        },
    })
    .then((response) => response.json())
    .then((data) => {
        username = data.username;
        gamepoints = data.gamepoints || 0;
        localStorage.setItem("username", username);
        localStorage.setItem("gamepoints", gamepoints);
        usernameDisplay.textContent = username;
        gamepointsDisplay.textContent = gamepoints;
    })
    .catch((error) => {
        console.error("Error fetching profile:", error);
    });
}

// Display the username and game points in the respective elements
if (username && gamepoints !== null) {
    usernameDisplay.textContent = username;
    gamepointsDisplay.textContent = gamepoints;
} else {
    // Handle the case where user data is not found in localStorage
    usernameDisplay.textContent = "No username found";
    gamepointsDisplay.textContent = "No game points found";
}

// Fetch profile information on page load
fetchProfile();

// Log out functionality
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("loginId");
    localStorage.removeItem("username");
    localStorage.removeItem("gamepoints");
    window.location.href = "/";
});

// Redeem coupon functionality
document.querySelectorAll('.redeem-btn').forEach(button => {
    button.addEventListener('click', () => {
        const pointsRequired = parseInt(button.getAttribute('data-points'));
        const voucherValue = parseInt(button.getAttribute('data-value'));

        if (gamepoints >= pointsRequired) {
            gamepoints -= pointsRequired;
            gamepointsDisplay.textContent = gamepoints;
            localStorage.setItem("gamepoints", gamepoints);

            // Update game points in the database
            fetch(`${ACCOUNTS_URL}/${loginId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "x-apikey": APIKEY,
                },
                body: JSON.stringify({ gamepoints: gamepoints }),
            })
            .then((response) => response.json())
            .then(() => {
                // Add coupon to the database
                fetch("https://mokesell-2304.restdb.io/rest/coupons", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-apikey": APIKEY,
                    },
                    body: JSON.stringify({
                        user: loginId,
                        amount: voucherValue,
                        used: false,
                    }),
                })
                .then((response) => response.json())
                .then(() => {
                    alert(`You have successfully redeemed a $${voucherValue} voucher!`);
                })
                .catch((error) => {
                    console.error("Error adding coupon:", error);
                });
            })
            .catch((error) => {
                console.error("Error updating game points:", error);
            });
        } else {
            alert("You do not have enough points to redeem this voucher.");
        }
    });
});