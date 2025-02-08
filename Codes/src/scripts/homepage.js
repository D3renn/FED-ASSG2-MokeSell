const APIKEY = "678a13b229bb6d4dd6c56bd2"; // API key for accessing the database
const CATEGORIES_URL = "https://mokesell-2304.restdb.io/rest/categories"; // URL for categories endpoint
const LISTINGS_URL = "https://mokesell-2304.restdb.io/rest/listings"; // URL for listings endpoint

// Event listener to trigger functions when the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    fetchCategories(); // Fetch and display categories
    fetchListings(); // Fetch and display listings
    setupFilterButtons(); // Set up filter buttons for categories
});

// Function to fetch categories from the database
function fetchCategories() {
    fetch(CATEGORIES_URL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": APIKEY, // Include the API key in the request headers
        },
    })
    .then((response) => response.json()) // Parse the response as JSON
    .then((data) => {
        const productList = document.getElementById("product-list");
        productList.innerHTML = ''; // Clear the product list to avoid duplication

        if (data.length === 0) {
            // Display a message if no categories are available
            productList.innerHTML = '<p>No categories available.</p>';
        } else {
            // Loop through each category and create a section for it
            data.forEach((category) => {
                const categorySection = `
                    <div class="product-section" data-category="${category.categoryName.toLowerCase()}">
                        <div class="section-header">
                            <h2>${category.categoryName}</h2>
                            <button class="view-all" onclick="redirectToCategory('${category._id}')">View All</button>
                        </div>
                        <div class="product-scroll" id="${category.categoryName.toLowerCase()}-list">
                            <p>Loading ${category.categoryName.toLowerCase()} listings...</p>
                        </div>
                    </div>
                `;
                // Insert the category section into the product list
                productList.insertAdjacentHTML('beforeend', categorySection);
            });
        }
    })
    .catch((error) => {
        console.error("Error fetching categories:", error); // Log any errors
    });
}

// Function to fetch listings from the database
function fetchListings() {
    // Fetch only listings with a quantity greater than 0
    fetch(`${LISTINGS_URL}?q={"quantity":{"$gt":0}}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": APIKEY, // Include the API key in the request headers
        },
    })
    .then((response) => response.json()) // Parse the response as JSON
    .then((data) => {
        if (data.length === 0) {
            // Display a message if no listings are available
            const productList = document.getElementById("product-list");
            productList.innerHTML = '<p>No listings available.</p>';
        } else {
            // Create a map to group listings by their categories
            const categoryListings = new Map();

            // Loop through each listing and group them by category
            data.forEach((listing) => {
                if (listing.categories) {
                    listing.categories.forEach((category) => {
                        const categoryName = category.categoryName.toLowerCase();
                        if (!categoryListings.has(categoryName)) {
                            // Initialize the category in the map if it doesn't exist
                            categoryListings.set(categoryName, {
                                categoryData: category,
                                listings: []
                            });
                        }
                        // Add the listing to the appropriate category
                        categoryListings.get(categoryName).listings.push(listing);
                    });
                }
            });

            // Render listings for each category
            categoryListings.forEach(({categoryData, listings}, categoryName) => {
                // Find or create the category section in the DOM
                let categorySection = document.querySelector(`.product-section[data-category="${categoryName}"]`);
                
                if (!categorySection) {
                    // Create a new section if it doesn't exist
                    categorySection = document.createElement('div');
                    categorySection.classList.add('product-section');
                    categorySection.setAttribute('data-category', categoryName);
                    categorySection.innerHTML = `
                        <div class="section-header">
                            <h2>${categoryData.categoryName}</h2>
                            <button class="view-all" onclick="redirectToCategory('${categoryData._id}')">View All</button>
                        </div>
                        <div class="product-scroll" id="${categoryName}-list"></div>
                    `;
                    document.getElementById("product-list").appendChild(categorySection);
                }

                // Get the container for the listings in this category
                const categoryList = document.getElementById(`${categoryName}-list`);
                categoryList.innerHTML = ''; // Clear the container to avoid duplication
                
                // Loop through each listing and create a card for it
                listings.forEach(listing => {
                    const listingCard = `
                        <div class="product-card" onclick="viewListing('${listing._id}')">
                            <img src="/src/images/${listing.image}" alt="${listing.title}">
                            <h3>${listing.title}</h3>
                            <p>${listing.description}</p>
                            <p>$${listing.price}</p>
                            <div class="category-badges">
                                ${listing.categories.map(cat => 
                                    `<span class="badge bg-secondary">${cat.categoryName}</span>`
                                ).join(' ')}
                            </div>
                            <p><span class="badge bg-info">${listing.condition || ''}</span></p>
                        </div>
                    `;
                    // Insert the listing card into the category container
                    categoryList.insertAdjacentHTML('beforeend', listingCard);
                });
            });
        }
    })
    .catch((error) => {
        console.error("Error fetching listings:", error); // Log any errors
    });
}

// Function to set up filter buttons for categories
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-button');
    // Show all sections initially
    document.querySelectorAll('.product-section').forEach(section => {
        section.style.display = 'block';
    });
    
    // Add click event listeners to each filter button
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            // Remove the active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add the active class to the clicked button
            button.classList.add('active');
            // Filter the products based on the selected category
            filterProducts(category);
        });
    });
}

// Function to filter products based on the selected category
function filterProducts(category) {
    const productSections = document.querySelectorAll('.product-section');
    productSections.forEach(section => {
        const sectionCategory = section.getAttribute('data-category');
        if (category === 'all') {
            // Show all sections if "All" is selected
            section.style.display = 'block';
        } else {
            // Show only the sections that match the selected category
            section.style.display = sectionCategory === category ? 'block' : 'none';
        }
    });
}

// Function to redirect to a specific category page
function redirectToCategory(categoryId) {
    localStorage.setItem("categoryId", categoryId); // Store the category ID in localStorage
    window.location.href = `/category`; // Redirect to the category page
}

// Function to view a specific listing
function viewListing(listingId) {
    localStorage.setItem("viewListingId", listingId); // Store the listing ID in localStorage
    window.location.href = `/listing/view`; // Redirect to the listing view page
}

// Example of fetching data from a local JSON file (for demonstration purposes)
fetch('data.json')
  .then(response => response.json()) // Parse the JSON response
  .then(data => console.log(data)) // Handle the data
  .catch(error => console.error('Error loading JSON:', error)); // Log any errors