const APIKEY = "678a13b229bb6d4dd6c56bd2";
const CATEGORIES_URL = "https://mokesell-2304.restdb.io/rest/categories";
const LISTINGS_URL = "https://mokesell-2304.restdb.io/rest/listings";

document.addEventListener("DOMContentLoaded", () => {
    fetchCategories();
    fetchListings();
    setupFilterButtons();
});

function fetchCategories() {
    fetch(CATEGORIES_URL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": APIKEY,
        },
    })
    .then((response) => response.json())
    .then((data) => {
        const productList = document.getElementById("product-list");
        productList.innerHTML = ''; // Clear the product list only once

        if (data.length === 0) {
            productList.innerHTML = '<p>No categories available.</p>';
        } else {
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
                productList.insertAdjacentHTML('beforeend', categorySection);
            });
        }
    })
    .catch((error) => {
        console.error("Error fetching categories:", error);
    });
}

function fetchListings() {
    fetch(`${LISTINGS_URL}?q={"quantity":{"$gt":0}}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": APIKEY,
        },
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.length === 0) {
            const productList = document.getElementById("product-list");
            productList.innerHTML = '<p>No listings available.</p>';
        } else {
            // Create a map to store listings by category
            const categoryListings = new Map();

            // Group listings by category
            data.forEach((listing) => {
                if (listing.categories) {
                    listing.categories.forEach((category) => {
                        const categoryName = category.categoryName.toLowerCase();
                        if (!categoryListings.has(categoryName)) {
                            categoryListings.set(categoryName, {
                                categoryData: category,
                                listings: []
                            });
                        }
                        categoryListings.get(categoryName).listings.push(listing);
                    });
                }
            });

            // Render listings for each category
            categoryListings.forEach(({categoryData, listings}, categoryName) => {
                let categorySection = document.querySelector(`.product-section[data-category="${categoryName}"]`);
                
                if (!categorySection) {
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

                const categoryList = document.getElementById(`${categoryName}-list`);
                categoryList.innerHTML = ''; // Clear once per category
                
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
                    categoryList.insertAdjacentHTML('beforeend', listingCard);
                });
            });
        }
    })
    .catch((error) => {
        console.error("Error fetching listings:", error);
    });
}

function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-button');
    // Show all sections initially
    document.querySelectorAll('.product-section').forEach(section => {
        section.style.display = 'block';
    });
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterProducts(category);
        });
    });
}

function filterProducts(category) {
    const productSections = document.querySelectorAll('.product-section');
    productSections.forEach(section => {
        const sectionCategory = section.getAttribute('data-category');
        if (category === 'all') {
            section.style.display = 'block';
        } else {
            section.style.display = sectionCategory === category ? 'block' : 'none';
        }
    });
}

function redirectToCategory(categoryId) {
    localStorage.setItem("categoryId", categoryId);
    window.location.href = `/category`;
}

function viewListing(listingId) {
    localStorage.setItem("viewListingId", listingId);
    window.location.href = `/listing/view`;
}
