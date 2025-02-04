const APIKEY = "678a13b229bb6d4dd6c56bd2";
const CATEGORIES_URL = "https://mokesell-2304.restdb.io/rest/categories";

document.addEventListener("DOMContentLoaded", () => {
    fetchCategories();
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
        const categoryList = document.getElementById("category-list");
        categoryList.innerHTML = '';

        if (data.length === 0) {
            categoryList.innerHTML = '<p>No categories available.</p>';
        } else {
            data.forEach((category) => {
                const categoryItem = `
                    <div class="category-item" onclick="redirectToCategory('${category._id}')">
                        <h4 class="category-item-title">${category.categoryName}</h4>
                    </div>
                `;
                categoryList.insertAdjacentHTML('beforeend', categoryItem);
            });
        }
    })
    .catch((error) => {
        console.error("Error fetching categories:", error);
    });
}

function redirectToCategory(categoryId) {
    localStorage.setItem("categoryId", categoryId);
    window.location.href = `/category`;
}
