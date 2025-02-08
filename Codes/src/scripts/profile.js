import { checkUserLoggedIn } from './utils.js';

// Ensure the user is logged in to view the profile
checkUserLoggedIn();

// Retrieve user data from localStorage
let username = localStorage.getItem("username"); 
let gamepoints = localStorage.getItem("gamepoints"); 
const APIKEY = "678a13b229bb6d4dd6c56bd2"; // API key for accessing the database
const ACCOUNTS_URL = "https://mokesell-2304.restdb.io/rest/accounts"; // URL for accounts endpoint
const loginId = localStorage.getItem("loginId"); // Retrieve the logged-in user's ID

// Get the DOM elements where user data will be displayed
let usernameDisplay = document.getElementById("usernameDisplay");
let gamepointsDisplay = document.getElementById("gamepointsDisplay");

// Function to fetch and update the user's profile information from the database
function fetchProfile() {
    fetch(`${ACCOUNTS_URL}/${loginId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": APIKEY, // Include the API key in the request headers
        },
    })
    .then((response) => response.json()) // Parse the response as JSON
    .then((data) => {
        // Update local variables and localStorage with fetched data
        username = data.username;
        gamepoints = data.gamepoints || 0; // Default to 0 if gamepoints is not set
        localStorage.setItem("username", username);
        localStorage.setItem("gamepoints", gamepoints);

        // Update the DOM with the fetched data
        usernameDisplay.textContent = username;
        gamepointsDisplay.textContent = gamepoints;
    })
    .catch((error) => {
        console.error("Error fetching profile:", error); // Log any errors
    });
}

// Display the username and game points if they exist in localStorage
if (username && gamepoints !== null) {
    usernameDisplay.textContent = username;
    gamepointsDisplay.textContent = gamepoints;
} else {
    // Handle cases where user data is not found in localStorage
    usernameDisplay.textContent = "No username found";
    gamepointsDisplay.textContent = "No game points found";
}

// Fetch profile information when the page loads
fetchProfile();

// Log out functionality
document.getElementById("logoutBtn").addEventListener("click", () => {
    // Clear user data from localStorage
    localStorage.removeItem("loginId");
    localStorage.removeItem("username");
    localStorage.removeItem("gamepoints");

    // Redirect the user to the homepage
    window.location.href = "/";
});

// Redeem coupon functionality
document.querySelectorAll('.redeem-btn').forEach(button => {
    button.addEventListener('click', () => {
        // Get the points required and voucher value from the button's data attributes
        const pointsRequired = parseInt(button.getAttribute('data-points'));
        const voucherValue = parseInt(button.getAttribute('data-value'));

        // Check if the user has enough game points to redeem the voucher
        if (gamepoints >= pointsRequired) {
            // Deduct the points and update the display
            gamepoints -= pointsRequired;
            gamepointsDisplay.textContent = gamepoints;
            localStorage.setItem("gamepoints", gamepoints);

            // Update the user's game points in the database
            fetch(`${ACCOUNTS_URL}/${loginId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "x-apikey": APIKEY,
                },
                body: JSON.stringify({ gamepoints: gamepoints }), // Send updated game points
            })
            .then((response) => response.json())
            .then(() => {
                // Add the redeemed coupon to the database
                fetch("https://mokesell-2304.restdb.io/rest/coupons", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-apikey": APIKEY,
                    },
                    body: JSON.stringify({
                        user: loginId, // Associate the coupon with the user
                        amount: voucherValue, // Set the voucher value
                        used: false, // Mark the coupon as unused
                    }),
                })
                .then((response) => response.json())
                .then(() => {
                    // Notify the user of successful redemption
                    alert(`You have successfully redeemed a $${voucherValue} voucher!`);
                })
                .catch((error) => {
                    console.error("Error adding coupon:", error); // Log any errors
                });
            })
            .catch((error) => {
                console.error("Error updating game points:", error); // Log any errors
            });
        } else {
            // Notify the user if they don't have enough points
            alert("You do not have enough points to redeem this voucher.");
        }
    });
});