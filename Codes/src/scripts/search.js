let allListings = [];
let activeFilters = {
    categories: [],
    conditions: [],
    price: { min: 0, max: 1000 }
};

document.addEventListener("DOMContentLoaded", () => {
    const APIKEY = "678a13b229bb6d4dd6c56bd2";
    const BASE_URL = "https://mokesell-2304.restdb.io/rest/listings";
    const searchQuery = localStorage.getItem("searchQuery");

    if (!searchQuery) {
        window.location.href = "/";
        return;
    }

    document.getElementById("search-query").textContent = searchQuery;
    const caseInsensitiveSearchQuery = new RegExp(
        `.*${searchQuery.split('').map(c => `[${c.toLowerCase()}${c.toUpperCase()}]`).join('')}.*`
    );

    const query = {
        "$and": [
            {
                "$or": [
                    { "title": { "$regex": caseInsensitiveSearchQuery} },
                    { "description": { "$regex": caseInsensitiveSearchQuery} },
                ]
            },
            { "quantity": { "$gt": 0 } }
        ]
    };

    fetch(`${BASE_URL}?q=${encodeURIComponent(JSON.stringify(query))}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": APIKEY,
        },
    })
    .then((response) => response.json())
    .then((data) => {
        allListings = data;
        setupFilters(data);
        displayResults(data);
    })
    .catch((error) => {
        console.error("Error fetching search results:", error);
        document.getElementById("product-grid").innerHTML = '<p>Error loading search results.</p>';
    });
});

// Setup filter buttons
document.querySelectorAll('.filter-button').forEach(button => {
    button.addEventListener('click', (e) => {
        const filterType = e.target.textContent.toLowerCase();
        const modalId = `#${filterType}Modal`;
        new bootstrap.Modal(document.querySelector(modalId)).show();
    });
});

function setupFilters(data) {
    // Setup category filters
    const categories = [...new Set(data.map(item => item.category))];
    const categoryHTML = categories.map(category => `
        <div class="checkbox-item">
            <input type="checkbox" id="${category}" value="${category}">
            <label for="${category}">${category}</label>
        </div>
    `).join('');
    document.getElementById('categoryCheckboxes').innerHTML = categoryHTML;

    // Setup condition filters
    const conditions = [...new Set(data.map(item => item.condition))];
    const conditionHTML = conditions.map(condition => `
        <div class="checkbox-item">
            <input type="checkbox" id="${condition}" value="${condition}">
            <label for="${condition}">${condition}</label>
        </div>
    `).join('');
    document.getElementById('conditionCheckboxes').innerHTML = conditionHTML;

    // Setup price range listeners
    document.getElementById('minPriceRange').addEventListener('input', (e) => {
        document.getElementById('minPrice').textContent = e.target.value;
    });
    document.getElementById('maxPriceRange').addEventListener('input', (e) => {
        document.getElementById('maxPrice').textContent = e.target.value;
    });
}

function applyFilters(filterType) {
    switch(filterType) {
        case 'category':
            activeFilters.categories = [...document.querySelectorAll('#categoryCheckboxes input:checked')]
                .map(cb => cb.value);
            break;
        case 'condition':
            activeFilters.conditions = [...document.querySelectorAll('#conditionCheckboxes input:checked')]
                .map(cb => cb.value);
            break;
        case 'price':
            activeFilters.price.min = parseInt(document.getElementById('minPriceRange').value);
            activeFilters.price.max = parseInt(document.getElementById('maxPriceRange').value);
            break;
    }

    // Apply all filters
    let filteredResults = allListings.filter(item => {
        const matchesCategory = activeFilters.categories.length === 0 || 
            activeFilters.categories.includes(item.category);
        const matchesCondition = activeFilters.conditions.length === 0 || 
            activeFilters.conditions.includes(item.condition);
        const matchesPrice = item.price >= activeFilters.price.min && 
            item.price <= activeFilters.price.max;
        
        return matchesCategory && matchesCondition && matchesPrice;
    });

    // Update UI
    displayResults(filteredResults);
    updateFilterButtons();
    bootstrap.Modal.getInstance(document.querySelector(`#${filterType}Modal`)).hide();
}

function updateFilterButtons() {
    document.querySelectorAll('.filter-button').forEach(button => {
        const filterType = button.textContent.toLowerCase();
        if ((filterType === 'category' && activeFilters.categories.length > 0) ||
            (filterType === 'condition' && activeFilters.conditions.length > 0) ||
            (filterType === 'price' && (activeFilters.price.min > 0 || activeFilters.price.max < 1000))) {
            button.classList.add('active-filter');
        } else {
            button.classList.remove('active-filter');
        }
    });
}

function displayResults(results) {
    const productGrid = document.getElementById("product-grid");
    productGrid.innerHTML = results.length === 0 ? '<p>No results found.</p>' : 
        results.map(listing => `
            <div class="product-card" onclick="viewListing('${listing._id}')">
                <img src="/src/images/${listing.image}" alt="${listing.title}" class="image-placeholder" />
                <h3>${listing.title}</h3>
                <p>${listing.description}</p>
                <p>$${listing.price}</p>
                <div class="category-badges">
                    ${listing.categories ? listing.categories.map(category => 
                        `<span class="badge bg-secondary">${category.categoryName}</span>`
                    ).join(' ') : ''}
                </div>
                <p><span class="badge bg-info">${listing.condition}</span></p>
            </div>
        `).join('');
}

function viewListing(listingId) {
    localStorage.setItem("viewListingId", listingId);
    window.location.href = `listing/view`;
}
