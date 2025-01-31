document.addEventListener("DOMContentLoaded", () => {
    const APIKEY = "678a13b229bb6d4dd6c56bd2";
    const BASE_URL = "https://mokesell-2304.restdb.io/rest/listings";
    const listingId = localStorage.getItem("viewListingId");

    if (!listingId) {
        window.location.href = "/listing";
        return;
    }

    fetch(`${BASE_URL}/${listingId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-apikey": APIKEY,
        },
    })
    .then((response) => response.json())
    .then((data) => {
        document.querySelector(".product-title").textContent = data.title;
        document.querySelector(".product-price").textContent = `S$${data.price}`;
        document.querySelector(".description-section p").textContent = data.description;
        document.querySelector(".product-info").innerHTML = `
            <p><strong>Condition:</strong> ${data.condition}</p>
            <p><strong>Brand:</strong> ${data.brand}</p>
            <p><strong>Size:</strong> ${data.size || "N/A"}</p>
            <p><strong>Category:</strong> ${data.categories.map(cat => cat.categoryName).join(", ")}</p>
        `;
        document.querySelector(".deal-method-section p").innerHTML = `${data.dealMethod} <span class="arrow">></span>`;
        document.querySelector(".seller-username").textContent = data.sellerID[0].username;
        document.querySelector(".image-section").innerHTML = `
            <img src="/src/images/${data.image}" alt="${data.title}" class="image-placeholder" />
        `;
    })
    .catch((error) => {
        console.error("Error fetching listing:", error);
        window.location.href = "/listing";
    });
});
