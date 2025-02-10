document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".filter-button");
    const sections = document.querySelectorAll(".product-section");
    
    // Add menu button functionality
    const menuBtn = document.querySelector('.menu-btn');
    const rightIcons = document.querySelector('.right-icons');
    
    if (menuBtn && rightIcons) {
        menuBtn.addEventListener('click', () => {
            rightIcons.classList.toggle('show');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuBtn.contains(e.target) && !rightIcons.contains(e.target)) {
                rightIcons.classList.remove('show');
            }
        });
    }
    
    // Function to filter sections
    function filterCategory(category) {
        sections.forEach((section) => {
            if (
                category === "all" ||
                section.getAttribute("data-category") === category
            ) {
                section.classList.add("show");
            } else {
                section.classList.remove("show");
            }
        });
    }
    
    // Event listeners for buttons
    buttons.forEach((button) => {
        button.addEventListener("click", function () {
            // Remove active class from all buttons
            buttons.forEach((btn) => btn.classList.remove("active"));
            this.classList.add("active");
            
            // Get category and filter
            const category = this.getAttribute("data-category");
            filterCategory(category);
        });
    });
    
    // Show all by default
    filterCategory("all");
    setupSearch();
});

function setupSearch() {
    const searchBar = document.querySelector(".search-bar");
    const searchButton = document.querySelector(".search-icon");

    searchButton.addEventListener("click", () => {
        const query = searchBar.value.trim();
        if (query) {
            localStorage.setItem("searchQuery", query);
            window.location.href = "search.html";
        }
    });

    searchBar.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            const query = searchBar.value.trim();
            if (query) {
                localStorage.setItem("searchQuery", query);
                window.location.href = "search.html";
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

function routeGame() {
    window.location.href = "game.html";
}

function routeHome() {
    window.location.href = "index.html";
}

function routeProfile() {
    window.location.href = "profile.html";
}

function routeListing() {
    window.location.href = "listing.html";
}

function routeChat() {
    window.location.href = "chat.html";
}

