// ==================== Product Data ====================
const products = [
    { id: 1, name: "Wireless Headphones", category: "electronics", price: 2999, oldPrice: 4999, rating: 4.5, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" },
    { id: 2, name: "Smart Watch Pro", category: "electronics", price: 4999, oldPrice: 7999, rating: 4.7, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400" },
    { id: 3, name: "Casual Denim Jacket", category: "fashion", price: 1899, oldPrice: 2999, rating: 4.3, img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400" },
    { id: 4, name: "Leather Handbag", category: "accessories", price: 2499, oldPrice: 3999, rating: 4.6, img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400" },
    { id: 5, name: "Running Sneakers", category: "fashion", price: 3499, oldPrice: 5499, rating: 4.4, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" },
    { id: 6, name: "Bluetooth Speaker", category: "electronics", price: 1999, oldPrice: 3299, rating: 4.2, img: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400" },
    { id: 7, name: "Sunglasses UV400", category: "accessories", price: 999, oldPrice: 1799, rating: 4.1, img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400" },
    { id: 8, name: "Winter Hoodie", category: "fashion", price: 1299, oldPrice: 2199, rating: 4.5, img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400" },
];

const featuredProducts = [
    { id: 9, name: "iPhone Style Smartphone", price: 54999, oldPrice: 69999, img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600", discount: "21% OFF" },
    { id: 10, name: "Premium Laptop", price: 65999, oldPrice: 84999, img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600", discount: "22% OFF" },
    { id: 11, name: "DSLR Camera", price: 42999, oldPrice: 55999, img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600", discount: "23% OFF" },
];

// ==================== State ====================
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let activeFilter = "all";
let searchTerm = "";

// ==================== DOM Elements ====================
const productContainer = document.getElementById("product-container");
const featuredContainer = document.getElementById("featured-container");
const cartSidebar = document.getElementById("cart-sidebar");
const cartItemsEl = document.getElementById("cart-items");
const cartCountEl = document.getElementById("cart-count");
const cartTotalEl = document.getElementById("cart-total");
const overlay = document.getElementById("overlay");
const toast = document.getElementById("toast");
const searchInput = document.getElementById("search-input");
const filterButtons = document.getElementById("filter-buttons");

// ==================== Helpers ====================
const formatPrice = (n) => "₹" + n.toLocaleString("en-IN");

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// ==================== Render Products ====================
function renderProducts() {
    const filtered = products.filter((p) => {
        const matchFilter = activeFilter === "all" || p.category === activeFilter;
        const matchSearch = p.name.toLowerCase().includes(searchTerm);
        return matchFilter && matchSearch;
    });

    if (filtered.length === 0) {
        productContainer.innerHTML = `<p class="no-results">No products found 😕 Try another search.</p>`;
        return;
    }

    productContainer.innerHTML = filtered.map((p) => `
        <div class="product-card">
            <img src="${p.img}" alt="${p.name}">
            <div class="product-info">
                <span class="product-category">${p.category}</span>
                <h3 class="product-name">${p.name}</h3>
                <div class="product-rating">${"★".repeat(Math.round(p.rating))} <span>(${p.rating})</span></div>
                <div class="product-bottom">
                    <span class="product-price">${formatPrice(p.price)}</span>
                    <button class="add-cart-btn" onclick="addToCart(${p.id})">
                        <i class="fas fa-cart-plus"></i> Add
                    </button>
                </div>
            </div>
        </div>
    `).join("");
}

function renderFeatured() {
    featuredContainer.innerHTML = featuredProducts.map((p) => `
        <div class="featured-card" onclick="addToCart(${p.id}, true)">
            <span class="discount-badge">${p.discount}</span>
            <img src="${p.img}" alt="${p.name}">
            <div class="featured-overlay">
                <h3>${p.name}</h3>
                <p><s>${formatPrice(p.oldPrice)}</s> <strong>${formatPrice(p.price)}</strong></p>
            </div>
        </div>
    `).join("");
}

// ==================== Cart Functions ====================
function addToCart(id, isFeatured = false) {
    const source = isFeatured ? featuredProducts : products;
    const product = source.find((p) => p.id === id);
    if (!product) return;

    const existing = cart.find((item) => item.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    saveCart();
    updateCartUI();
    showToast(`${product.name} added to cart! 🎉`);
}

function removeFromCart(id) {
    cart = cart.filter((item) => item.id !== id);
    saveCart();
    updateCartUI();
}

function changeQty(id, delta) {
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) removeFromCart(id);
    else { saveCart(); updateCartUI(); }
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
    const totalPrice = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    cartCountEl.textContent = totalItems;
    cartTotalEl.textContent = formatPrice(totalPrice);

    if (cart.length === 0) {
        cartItemsEl.innerHTML = `<p class="empty-cart">Your cart is empty 🛒<br>Start adding some products!</p>`;
        return;
    }

    cartItemsEl.innerHTML = cart.map((item) => `
        <div class="cart-item">
            <img src="${item.img}" alt="${item.name}">
            <div class="cart-item-details">
                <p class="cart-item-name">${item.name}</p>
                <p class="cart-item-price">${formatPrice(item.price)}</p>
            </div>
            <div class="qty-controls">
                <button onclick="changeQty(${item.id}, -1)">−</button>
                <span>${item.qty}</span>
                <button onclick="changeQty(${item.id}, 1)">+</button>
            </div>
            <i class="fas fa-trash remove-btn" onclick="removeFromCart(${item.id})"></i>
        </div>
    `).join("");
}

// ==================== Cart Sidebar Toggle ====================
function openCart() {
    cartSidebar.classList.add("open");
    overlay.classList.add("show");
}
function closeCart() {
    cartSidebar.classList.remove("open");
    overlay.classList.remove("show");
}

document.getElementById("cart-button").addEventListener("click", openCart);
document.getElementById("cart-close").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

// ==================== Checkout ====================
document.getElementById("checkout-btn").addEventListener("click", () => {
    if (cart.length === 0) {
        showToast("Your cart is empty! Add something first 😊");
        return;
    }
    showToast(`Order placed! Total: ${cartTotalEl.textContent} 🎉`);
    cart = [];
    saveCart();
    updateCartUI();
    setTimeout(closeCart, 1500);
});

// ==================== Search & Filter ====================
searchInput.addEventListener("input", (e) => {
    searchTerm = e.target.value.toLowerCase().trim();
    renderProducts();
});

filterButtons.addEventListener("click", (e) => {
    if (!e.target.classList.contains("filter-btn")) return;
    document.querySelector(".filter-btn.active").classList.remove("active");
    e.target.classList.add("active");
    activeFilter = e.target.dataset.filter;
    renderProducts();
});

// ==================== Dark Mode Toggle ====================
const themeButton = document.getElementById("theme-button");
themeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    const isDark = document.body.classList.contains("dark-theme");
    themeButton.className = isDark ? "fas fa-sun change-theme" : "fas fa-moon change-theme";
    localStorage.setItem("theme", isDark ? "dark" : "light");
});
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-theme");
    themeButton.className = "fas fa-sun change-theme";
}

// ==================== Mobile Menu ====================
const navMenu = document.getElementById("nav-menu");
document.getElementById("nav-toggle").addEventListener("click", () => navMenu.classList.add("show-menu"));
document.getElementById("nav-close").addEventListener("click", () => navMenu.classList.remove("show-menu"));
document.querySelectorAll(".nav__link").forEach((link) =>
    link.addEventListener("click", () => navMenu.classList.remove("show-menu"))
);

// ==================== Active Link on Scroll ====================
const sections = document.querySelectorAll("section[id]");
window.addEventListener("scroll", () => {
    const scrollY = window.pageYOffset;
    sections.forEach((section) => {
        const height = section.offsetHeight;
        const top = section.offsetTop - 100;
        const id = section.getAttribute("id");
        const link = document.querySelector(`.nav__menu a[href*="${id}"]`);
        if (link) {
            if (scrollY > top && scrollY <= top + height) link.classList.add("active-link");
            else link.classList.remove("active-link");
        }
    });
});

// ==================== Initialize ====================
renderProducts();
renderFeatured();
updateCartUI();