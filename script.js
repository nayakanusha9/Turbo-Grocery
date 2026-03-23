// ================= USERS =================
let users = JSON.parse(localStorage.getItem("users")) || [];

// ================= PROFILE =================
function toggleProfile(e){
    e.stopPropagation();
    let menu = document.getElementById("profileMenu");
    if(!menu) return;

    menu.style.display = (menu.style.display === "block") ? "none" : "block";
}

function updateProfile(){
    let user = JSON.parse(localStorage.getItem("loggedInUser"));

    let icon = document.getElementById("profileIcon");
    let bigIcon = document.getElementById("bigIcon");
    let name = document.getElementById("profileName");

    if(!icon || !bigIcon || !name) return;

    if(user){
        let letter = user.name.charAt(0).toUpperCase();
        icon.innerText = letter;
        bigIcon.innerText = letter;
        name.innerHTML = user.name + "<br><small>"+user.email+"</small>";
    } else{
        icon.innerText = "U";
        bigIcon.innerText = "U";
        name.innerText = "User";
    }
}

// CLOSE PROFILE
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
        </div>`;
    });
}

// ⭐ STARS
function getStars(r){
    let s="";
    for(let i=1;i<=5;i++){
        if(i<=r) s+='<i class="fa-solid fa-star"></i>';
        else s+='<i class="fa-regular fa-star"></i>';
    }
    return s;
}

// ================= POPUP =================
function openProduct(i){
    let p=products[i];
    window.selectedProduct=p;

    document.getElementById("popupImg").src=p.img;
    document.getElementById("popupName").innerText=p.name;
    document.getElementById("popupDesc").innerText=p.desc;
    document.getElementById("popupPrice").innerText="₹"+p.price;

    document.getElementById("productPopup").style.display="flex";

    let btn=document.getElementById("cartBtn");

    if(isInCart(p.name)){
        btn.innerText="Added to Cart";
        btn.style.background="gray";
    } else{
        btn.innerText="Add to Cart";
        btn.style.background="#1e88e5";
    }
}

function closePopup(){
    document.getElementById("productPopup").style.display="none";
}

// ================= CART =================
function getCart(){
    return JSON.parse(localStorage.getItem("cart"))||[];
}

function saveCart(c){
    localStorage.setItem("cart",JSON.stringify(c));
}

function addToCart(){
    let cart=getCart();
    let p=window.selectedProduct;

    if(!p) return;

    let found=cart.find(i=>i.name===p.name);

    if(found) found.qty++;
    else cart.push({...p,qty:1});

    saveCart(cart);

    document.getElementById("cartBtn").innerText="Added to Cart";
    document.getElementById("cartBtn").style.background="gray";

    showToast("Added to Cart 🛒");

    loadProducts();
    loadCategoryProducts();
}

function isInCart(name){
    return getCart().some(i=>i.name===name);
}

function removeItem(index){
    let cart = getCart();
    cart.splice(index,1);
    saveCart(cart);
    loadCart();
}

function increaseQty(index){
    let cart = getCart();
    cart[index].qty++;
    saveCart(cart);
    loadCart();
}

function decreaseQty(index){
    let cart = getCart();

    if(cart[index].qty > 1){
        cart[index].qty--;
    } else{
        cart.splice(index,1);
    }

    saveCart(cart);
    loadCart();
}

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

    cart.forEach((item, index)=>{
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
        </div>`;
    });

    if(totalBox) totalBox.innerText = "Total: ₹" + total;
}

// ================= ORDERS =================
function buyNow(){
    let orders=JSON.parse(localStorage.getItem("orders"))||[];

    if(!window.selectedProduct) return;

    orders.push({...window.selectedProduct,status:"Ordered"});

    localStorage.setItem("orders",JSON.stringify(orders));

    window.location.href="orders.html";
}

function loadOrders(){
    let container = document.getElementById("ordersContainer");
    if(!container) return;

    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    container.innerHTML = "";

    if(orders.length === 0){
        container.innerHTML = "<p>No orders yet 📦</p>";
        return;
    }

    orders.forEach((item) => {
        container.innerHTML += `
        <div class="order-card">
            <img src="${item.img}">
            <div class="order-details">
                <h3>${item.name}</h3>
                <p>${item.desc}</p>
                <p class="price">₹${item.price}</p>
                <div class="status ${item.status.toLowerCase()}">${item.status}</div>
            </div>
        </div>`;
    });
}

function clearOrders(){
    localStorage.setItem("orders", JSON.stringify([]));
    loadOrders();
    showToast("Orders cleared 🗑️");
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
        </div>`;
    });
}

function openCategory(cat){
    localStorage.setItem("selectedCategory", cat);
    window.location.href = "category-products.html";
}

function loadCategoryProducts(){
    let container = document.getElementById("productContainer");
    let title = document.getElementById("catTitle");

    if(!container) return;

    let cat = localStorage.getItem("selectedCategory");
    if(!cat) return;

    if(title) title.innerText = cat + " 🛍️";

    let filtered = products.filter(p => p.category === cat);

    container.innerHTML = "";

    filtered.forEach((p) => {
        container.innerHTML += `
        <div class="product-card ${isInCart(p.name) ? 'in-cart' : ''}" onclick="openProductByName('${p.name}')">
            <img src="${p.img}">
            <h3>${p.name}</h3>
            <p class="price">₹${p.price}</p>
            <p class="rating">${getStars(p.rating)}</p>
        </div>`;
    });
}

function openProductByName(name){
    let p = products.find(i=>i.name===name);
    if(!p) return;
    openProduct(products.indexOf(p));
}

function goBack(){
    window.location.href="categories.html";
}

// ================= SEARCH =================
function searchProducts(){
    let input = document.getElementById("searchInput");
    if(!input) return;

    let value = input.value.toLowerCase();
    let container = document.getElementById("productContainer");
    if(!container) return;

    if(value === ""){
        loadProducts();
        return;
    }

    let filtered = products.filter(p => p.name.toLowerCase().includes(value));

    container.innerHTML = "";

    if(filtered.length === 0){
        container.innerHTML = "<p>Item not available 😔</p>";
        return;
    }

    filtered.forEach(p => {
        container.innerHTML += `
        <div class="product-card" onclick="openProductByName('${p.name}')">
            <img src="${p.img}">
            <h3>${p.name}</h3>
            <p class="price">₹${p.price}</p>
            <p class="rating">${getStars(p.rating)}</p>
        </div>`;
    });
}

// ================= AUTH =================
function signup(){
    let name = document.getElementById("name").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let email = document.getElementById("email").value.trim();
    let address = document.getElementById("address").value.trim();
    let password = document.getElementById("password").value.trim();

    let users = JSON.parse(localStorage.getItem("users")) || [];

    users.push({name, phone, email, address, password});
    localStorage.setItem("users", JSON.stringify(users));

    showToast("Signup successful ✅");

    document.getElementById("name").value="";
    document.getElementById("phone").value="";
    document.getElementById("email").value="";
    document.getElementById("address").value="";
    document.getElementById("password").value="";
}

function login(){
    let name = document.getElementById("loginName").value;
    let pass = document.getElementById("loginPassword").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let user = users.find(u => u.name === name && u.password === pass);

    if(user){
        localStorage.setItem("loggedInUser", JSON.stringify(user));
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

function goBackHome(){
    window.location.href = "index.html";
}
// ================= TOAST =================
function showToast(msg){
    let t=document.getElementById("toast");
    if(!t) return;

    t.innerText=msg;
    t.style.display="block";

    setTimeout(()=>t.style.display="none",2000);
}

// ================= LOAD =================
window.onload = function(){
    updateProfile();

    if(document.getElementById("productContainer") && !window.location.href.includes("category-products")){
        loadProducts();
    }

    if(document.getElementById("cartContainer")){
        loadCart();
    }

    if(document.getElementById("ordersContainer")){
        loadOrders();
    }

    if(document.getElementById("categoryContainer")){
        loadCategories();
    }

    if(window.location.href.includes("category-products")){
        loadCategoryProducts();
    }
};