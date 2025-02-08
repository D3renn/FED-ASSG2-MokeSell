// Function to set up the search functionality for the search bar and button.
function setupSearch() {
    // Select the search bar input element and the search button.
    const searchBar = document.querySelector(".search-bar");
    const searchButton = document.querySelector(".search-icon");

    // Add a click event listener to the search button.
    searchButton.addEventListener("click", () => {
        // Get the trimmed value of the search bar (removing extra spaces).
        const query = searchBar.value.trim();
        
        // If the query is not empty, store it in localStorage and redirect to the search page.
        if (query) {
            localStorage.setItem("searchQuery", query);  // Store the search query in localStorage.
            window.location.href = "/search";  // Redirect to the search results page.
        }
    });

    // Add a keypress event listener to the search bar to allow pressing "Enter" to trigger the search.
    searchBar.addEventListener("keypress", (event) => {
        // Check if the pressed key is "Enter".
        if (event.key === "Enter") {
            const query = searchBar.value.trim();  // Get the trimmed value of the search bar.
            
            // If the query is not empty, store it in localStorage and redirect to the search page.
            if (query) {
                localStorage.setItem("searchQuery", query);  // Store the search query in localStorage.
                window.location.href = "/search";  // Redirect to the search results page.
            }
        }
    });
}

// Variable to keep track of the current advertisement page.
let currentPage = 1;

// Select the advertisement slider container and all dot indicators.
const slider = document.querySelector('.advertisement-slider');
const dots = document.querySelectorAll('.dot');

// Function to automatically slide between advertisement pages.
function slideAdvertisements() {
    // If the current page is 1, move to page 2 by translating the slider 50% to the left.
    if (currentPage === 1) {
        slider.style.transform = 'translateX(-50%)';  // Move to the second advertisement.
        currentPage = 2;  // Update the current page to 2.
    } else {
        // If the current page is 2, move back to page 1 by resetting the slider position.
        slider.style.transform = 'translateX(0%)';  // Move back to the first advertisement.
        currentPage = 1;  // Update the current page to 1.
    }
    
    // Update the active state of the dot indicators.
    updateDots();
}

// Function to update the active state of the dot indicators based on the current page.
function updateDots() {
    dots.forEach((dot, index) => {
        // If the dot corresponds to the current page, add the 'active' class; otherwise, remove it.
        if (index + 1 === currentPage) {
            dot.classList.add('active');  // Mark the dot as active.
        } else {
            dot.classList.remove('active');  // Remove the active state from other dots.
        }
    });
}

// Add click event listeners to each dot indicator to allow manual navigation between advertisements.
dots.forEach(dot => {
    dot.addEventListener('click', () => {
        // Get the page number associated with the clicked dot.
        const page = parseInt(dot.getAttribute('data-page'));
        
        // If the clicked dot represents a different page than the current one, switch to that page.
        if (page !== currentPage) {
            currentPage = page;  // Update the current page.
            slider.style.transform = `translateX(${-(page - 1) * 50}%)`;  // Move the slider to the corresponding page.
            updateDots();  // Update the active state of the dots.
        }
    });
});

// Automatically change the advertisement every 5 seconds by calling the slideAdvertisements function.
setInterval(slideAdvertisements, 5000);

// Function to navigate to the game page.
function routeGame() {
    window.location.href = "/game";  // Redirect to the game page.
}

// Function to navigate to the home page.
function routeHome() {
    window.location.href = "/";  // Redirect to the home page.
}

// Function to navigate to the user profile page.
function routeProfile() {
    window.location.href = "/profile";  // Redirect to the profile page.
}

// Function to navigate to the listing page.
function routeListing() {
    window.location.href = "/listing";  // Redirect to the listing page.
}

// Function to navigate to the chat page.
function routeChat() {
    window.location.href = "/chat";  // Redirect to the chat page.
}