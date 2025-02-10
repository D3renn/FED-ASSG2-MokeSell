document.addEventListener("DOMContentLoaded", () => {
    const toTopButton = document.getElementById("toTopBtn");

    // Add click event listener to scroll to the top
    toTopButton.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth" // Smooth scrolling effect
        });
    });
  });