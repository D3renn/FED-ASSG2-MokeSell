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
        "$or": [
            { "title": { "$regex": caseInsensitiveSearchQuery} },
            { "description": { "$regex": caseInsensitiveSearchQuery} },
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
        const productGrid = document.getElementById("product-grid");
        productGrid.innerHTML = '';

        if (data.length === 0) {
            productGrid.innerHTML = '<p>No results found.</p>';
        } else {
            data.forEach((listing) => {
                const productCard = `
                    <div class="product-card" onclick="viewListing('${listing._id}')">
                        <img src="/src/images/${listing.image}" alt="${listing.title}" class="image-placeholder" />
                        <h3>${listing.title}</h3>
                        <p>${listing.description}</p>
                        <p>$${listing.price}</p>
                    </div>
                `;
                productGrid.insertAdjacentHTML('beforeend', productCard);
            });
        }
    })
    .catch((error) => {
        console.error("Error fetching search results:", error);
        document.getElementById("product-grid").innerHTML = '<p>Error loading search results.</p>';
    });
});


function viewListing(listingId) {
    localStorage.setItem("viewListingId", listingId);
    window.location.href = `/listing/view`;
}
