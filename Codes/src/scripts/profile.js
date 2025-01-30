import { checkUserLoggedIn } from './utils.js';

// need to be logged in to view profile
checkUserLoggedIn();


// Store the user ID in localStorage
let username = localStorage.getItem("username"); 
let gamepoints = localStorage.getItem("gamepoints"); 

// Get the elements where the user data will be displayed
let usernameDisplay = document.getElementById("usernameDisplay");
let gamepointsDisplay = document.getElementById("gamepointsDisplay");

// Display the username and game points in the respective elements
if (username && gamepoints !== null) {
    usernameDisplay.textContent = username;
    gamepointsDisplay.textContent = gamepoints;
} else {
    // Handle the case where user data is not found in localStorage
    usernameDisplay.textContent = "No username found";
    gamepointsDisplay.textContent = "No game points found";
}