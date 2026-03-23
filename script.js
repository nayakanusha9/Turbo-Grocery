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
    } else {
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
    } else {
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
function getCart(){
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart){
    localStorage.setItem("cart", JSON.stringify(cart));
}

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
    loadCategoryProducts();

    document.getElementById("cartBtn").innerText = "Added to Cart";
    document.getElementById("cartBtn").style.background = "gray";
}

function isInCart(name){
    let cart = getCart();
    return cart.some(item => item.name === name);
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