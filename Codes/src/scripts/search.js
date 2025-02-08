// Event listener to trigger the search functionality when the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    const APIKEY = "678a13b229bb6d4dd6c56bd2"; // API key for accessing the database
    const BASE_URL = "https://mokesell-2304.restdb.io/rest/listings"; // Base URL for listings endpoint
    const searchQuery = localStorage.getItem("searchQuery"); // Retrieve the search query from localStorage

    // Redirect to the homepage if no search query is found
    if (!searchQuery) {
        window.location.href = "/";
        return;
    }

    // Display the search query on the page
    document.getElementById("search-query").textContent = searchQuery;

    // Create a case-insensitive regex pattern for the search query
    const caseInsensitiveSearchQuery = new RegExp(
        `.*${searchQuery.split('').map(c => `[${c.toLowerCase()}${c.toUpperCase()}]`).join('')}.*`
    );

    // Define the query to search for listings that match the search query in title or description
    const query = {
        "$and": [
            {
                "$or": [
                    { "title": { "$regex": caseInsensitiveSearchQuery} }, // Match title
                    { "description": { "$regex": caseInsensitiveSearchQuery} }, // Match description
                ]
            },
            { "quantity": { "$gt": 0 } } // Ensure the listing has a quantity greater than 0
        ]
    };

    // Fetch listings from the database that match the search query
    fetch(`${BASE_URL}?q=${encodeURIComponent(JSON.stringify(query))}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": APIKEY, // Include the API key in the request headers
        },
    })
    .then((response) => response.json()) // Parse the response as JSON
    .then((data) => {
        const productGrid = document.getElementById("product-grid");
        productGrid.innerHTML = ''; // Clear the product grid to avoid duplication

        if (data.length === 0) {
            // Display a message if no results are found
            productGrid.innerHTML = '<p>No results found.</p>';
        } else {
            // Loop through the search results and create a product card for each listing
            data.forEach((listing) => {
                const productCard = `
                    <div class="product-card" onclick="viewListing('${listing._id}')">
                        <img src="/src/images/${listing.image}" alt="${listing.title}" class="image-placeholder" />
                        <h3>${listing.title}</h3>
                        <p>${listing.description}</p>
                        <p>$${listing.price}</p>
                    </div>
                `;
                // Insert the product card into the product grid
                productGrid.insertAdjacentHTML('beforeend', productCard);
            });
        }
    })
    .catch((error) => {
        // Log any errors and display an error message
        console.error("Error fetching search results:", error);
        document.getElementById("product-grid").innerHTML = '<p>Error loading search results.</p>';
    });
});

// Function to view a specific listing
function viewListing(listingId) {
    localStorage.setItem("viewListingId", listingId); // Store the listing ID in localStorage
    window.location.href = `/listing/view`; // Redirect to the listing view page
}