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
            window.location.href = "/search";
        }
    });

    searchBar.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            const query = searchBar.value.trim();
            if (query) {
                localStorage.setItem("searchQuery", query);
                window.location.href = "/search";
            }
        }
    });
}

function routeGame() {
    window.location.href = "/game";
}

function routeHome() {
    window.location.href = "/";
}

function routeProfile() {
    window.location.href = "/profile";
}

function routeListing() {
    window.location.href = "/listing";
}

function routeChat() {
    window.location.href = "/chat";
}

