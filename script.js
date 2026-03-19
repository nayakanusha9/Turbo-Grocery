// ================= USERS =================
let users = JSON.parse(localStorage.getItem("users")) || [];

// ================= PROFILE =================
function toggleProfile(e){
    e.stopPropagation();
    let menu = document.getElementById("profileMenu");
    if(menu){
        menu.style.display = (menu.style.display === "block") ? "none" : "block";
    }
}

function updateProfile(){
    let user = localStorage.getItem("loggedInUser");

    let icon = document.getElementById("profileIcon");
    let bigIcon = document.getElementById("bigIcon");
    let name = document.getElementById("profileName");

    if(!icon || !bigIcon || !name) return;

    if(user){
        let letter = user.charAt(0).toUpperCase();
        icon.innerText = letter;
        bigIcon.innerText = letter;
        name.innerText = user;
    } else{
        icon.innerText = "👤";
        bigIcon.innerText = "👤";
        name.innerText = "User";
    }
}

// ================= AUTH =================
function signup(){
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    users.push({name,email,password});
    localStorage.setItem("users", JSON.stringify(users));

    alert("Signup successful");
    window.location.href="login.html";
}

function login(){
    let name = document.getElementById("loginName").value;
    let pass = document.getElementById("loginPassword").value;

    let user = users.find(u=>u.name===name && u.password===pass);

    if(user){
        localStorage.setItem("loggedInUser", name);
        window.location.href="index.html";
    } else{
        alert("Invalid login");
    }
}

function logout(){
    localStorage.removeItem("loggedInUser");
    updateProfile();
}

// ================= NAV =================
function goSignup(){ window.location.href="signup.html"; }
function goLogin(){ window.location.href="login.html"; }

// ================= CLOSE PROFILE =================
document.addEventListener("click", function(e){
    let menu = document.getElementById("profileMenu");
    if(menu && !menu.contains(e.target)){
        menu.style.display = "none";
    }
});

// ================= PRODUCTS =================
function loadProducts(){
    let container = document.getElementById("productContainer");
    if(!container) return;

    container.innerHTML = "";

    products.forEach((p, index) => {
        container.innerHTML += `
        <div class="product-card ${isInCart(p.name) ? 'in-cart' : ''}" onclick="openProduct(${index})">
            <img src="${p.img}">
            <h3>${p.name}</h3>
            <p class="price">₹${p.price}</p>
            <p class="rating">${getStars(p.rating)}</p>
        </div>
        `;
    });
}

// ⭐ STAR GENERATOR
function getStars(rating){
    let stars = "";
    let full = Math.floor(rating);
    let half = rating % 1 !== 0;

    for(let i=0; i<full; i++){
        stars += '<i class="fa-solid fa-star"></i>';
    }

    if(half){
        stars += '<i class="fa-solid fa-star-half-stroke"></i>';
    }

    let empty = 5 - Math.ceil(rating);

    for(let i=0; i<empty; i++){
        stars += '<i class="fa-regular fa-star"></i>';
    }

    return stars;
}

// ================= PRODUCT POPUP =================
function openProduct(index){
    let p = products[index];

    document.getElementById("popupImg").src = p.img;
    document.getElementById("popupName").innerText = p.name;
    document.getElementById("popupDesc").innerText = p.desc;
    document.getElementById("popupPrice").innerText = "₹" + p.price;

    document.getElementById("productPopup").style.display = "flex";

    window.selectedProduct = p;

    let btn = document.getElementById("cartBtn");

    if(isInCart(p.name)){
        btn.innerText = "Added to Cart";
        btn.style.background = "gray";
    }else{
        btn.innerText = "Add to Cart";
        btn.style.background = "#1e88e5";
    }
}

function closePopup(){
    document.getElementById("productPopup").style.display = "none";
}

// ================= CART =================

// Get cart
function getCart(){
    return JSON.parse(localStorage.getItem("cart")) || [];
}

// Save cart
function saveCart(cart){
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Add to cart
function addToCart(){
    let cart = getCart();
    let p = window.selectedProduct;

    if(!p){
        showToast("Select product first ❗");
        return;
    }

    let found = cart.find(item => item.name === p.name);

    if(found){
        found.qty += 1;
    }else{
        cart.push({...p, qty:1});
    }

    saveCart(cart);

    showToast("Added to cart 🛒");

    loadProducts();

    document.getElementById("cartBtn").innerText = "Added to Cart";
    document.getElementById("cartBtn").style.background = "gray";
}

// Check if in cart
function isInCart(name){
    let cart = getCart();
    return cart.some(item => item.name === name);
}

// Increase qty
function increaseQty(index){
    let cart = getCart();
    cart[index].qty++;
    saveCart(cart);
    loadCart();
}

// Decrease qty
function decreaseQty(index){
    let cart = getCart();

    if(cart[index].qty > 1){
        cart[index].qty--;
    }else{
        cart.splice(index,1);
    }

    saveCart(cart);
    loadCart();
}

// Remove item
function removeItem(index){
    let cart = getCart();
    cart.splice(index,1);
    saveCart(cart);
    loadCart();
}

// Load cart page
function loadCart(){
    let container = document.getElementById("cartContainer");
    let totalBox = document.getElementById("totalPrice");

    if(!container) return;

    let cart = getCart();

    container.innerHTML = "";

    if(cart.length === 0){
        container.innerHTML = "<p>Your cart is empty 🛒</p>";
        if(totalBox) totalBox.innerText = "Total: ₹0";
        return;
    }

    let total = 0;

    cart.forEach((item, index) => {

        total += item.price * item.qty;

        container.innerHTML += `
        <div class="cart-item">
            <img src="${item.img}">
            <div class="cart-info">
                <h3>${item.name}</h3>
                <p>${item.desc}</p>
                <p>₹${item.price}</p>

                <div class="qty">
                    <button onclick="decreaseQty(${index})">-</button>
                    <span>${item.qty}</span>
                    <button onclick="increaseQty(${index})">+</button>
                </div>

                <button class="remove" onclick="removeItem(${index})">Remove</button>
            </div>
        </div>
        `;
    });

    if(totalBox) totalBox.innerText = "Total: ₹" + total;
}

// ================= BUY =================
function buyNow(){
    let p = window.selectedProduct;

    if(!p){
        showToast("Select product first ❗");
        return;
    }

    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    orders.push({
        ...p,
        qty:1,
        status:"Ordered"
    });

    localStorage.setItem("orders", JSON.stringify(orders));

    showToast("Order placed ✅");

    setTimeout(()=>{
        window.location.href = "orders.html";
    },1000);
}

// ================= TOAST =================
function showToast(msg){
    let toast = document.getElementById("toast");
    if(!toast) return;

    toast.innerText = msg;
    toast.style.display = "block";

    setTimeout(()=>{
        toast.style.display = "none";
    },2000);
}

// ================= ORDERS =================
function loadOrders(){
    let container = document.getElementById("ordersContainer");
    if(!container) return;

    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    container.innerHTML = "";

    if(orders.length === 0){
        container.innerHTML = "<p>No orders yet 📦</p>";
        return;
    }

    orders.forEach((item, index) => {

        container.innerHTML += `
        <div class="order-item">
            <img src="${item.img}">
            <div class="order-info">
                <h3>${item.name}</h3>
                <p>${item.desc}</p>
                <p>₹${item.price}</p>

                <div class="status ${item.status.toLowerCase()}">
                    ${item.status}
                </div>
            </div>
        </div>
        `;
    });

    updateOrderStatus();

    function clearOrders(){
        let confirmClear = confirm("Are you sure to clear all orders?");

        if(confirmClear){
            localStorage.setItem("orders", JSON.stringify([])); // safer than remove
            loadOrders();
            showToast("All orders cleared 🗑️");
        }
    }
}

// ================= ORDERSTATUS =================
function updateOrderStatus(){
    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    orders.forEach(o => {
        if(o.status === "Ordered"){
            o.status = "Shipped";
        } else if(o.status === "Shipped"){
            o.status = "Delivered";
        }
    });

    localStorage.setItem("orders", JSON.stringify(orders));
}

// ================= CATEGORY =================
function loadCategories(){
    let container = document.getElementById("categoryContainer");
    if(!container) return;

    let unique = [...new Set(products.map(p => p.category))];

    container.innerHTML = "";

    unique.forEach(cat => {
        container.innerHTML += `
        <div class="category-card" onclick="openCategory('${cat}')">
            <i class="fa-solid fa-basket-shopping"></i>
            <h3>${cat}</h3>
        </div>
        `;
    });
}

// Open category page
function openCategory(cat){
    localStorage.setItem("selectedCategory", cat);
    window.location.href = "category-products.html";
}

// ================= CATEGORY-PRODUCT =================
function loadCategoryProducts(){
    let container = document.getElementById("productContainer");
    let title = document.getElementById("catTitle");

    if(!container) return;

    let cat = localStorage.getItem("selectedCategory");

    title.innerText = cat + " 🛍️";

    let filtered = products.filter(p => p.category === cat);

    container.innerHTML = "";

    filtered.forEach((p, index) => {
        container.innerHTML += `
        <div class="product-card" onclick="openProduct(${index})">
            <img src="${p.img}">
            <h3>${p.name}</h3>
            <p>₹${p.price}</p>
        </div>
        `;
    });
}

// ================= LOAD =================
window.onload = function(){
    updateProfile();
    loadProducts();
    loadCart();
    loadOrders();
    loadCategories();        
    loadCategoryProducts();  
};