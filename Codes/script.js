document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll(".filter-button");
    const sections = document.querySelectorAll(".product-section");

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
});

// go game.html on click
function routeGame() {
    window.location.href = "game.html";
}
