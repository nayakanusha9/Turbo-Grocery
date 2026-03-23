// USERS
let users = JSON.parse(localStorage.getItem("users")) || [];

// PROFILE
function toggleProfile(e){
    e.stopPropagation();
    let menu = document.getElementById("profileMenu");
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
}

function updateProfile(){
    let user = localStorage.getItem("loggedInUser");

    let icon = document.getElementById("profileIcon");
    let bigIcon = document.getElementById("bigIcon");
    let name = document.getElementById("profileName");

    if(!icon) return;

    if(user){
        let letter = user.charAt(0).toUpperCase();
        icon.innerText = letter;
        if(bigIcon) bigIcon.innerText = letter;
        if(name) name.innerText = user;
    } else{
        icon.innerText = "👤";
    }
}

// CLOSE PROFILE
document.addEventListener("click", function(e){
    let menu = document.getElementById("profileMenu");
    if(menu && !menu.contains(e.target)){
        menu.style.display = "none";
    }
});

// PRODUCTS
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

// STARS
function getStars(r){
    let s="";
    for(let i=1;i<=5;i++){
        if(i<=r) s+='<i class="fa-solid fa-star"></i>';
        else s+='<i class="fa-regular fa-star"></i>';
    }
    return s;
}

// POPUP
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
        btn.style.background="blue";
    }
}

function closePopup(){
    document.getElementById("productPopup").style.display="none";
}

// CART
function getCart(){
    return JSON.parse(localStorage.getItem("cart"))||[];
}

function saveCart(c){
    localStorage.setItem("cart",JSON.stringify(c));
}

function addToCart(){
    let cart=getCart();
    let p=window.selectedProduct;

    let found=cart.find(i=>i.name===p.name);

    if(found) found.qty++;
    else cart.push({...p,qty:1});

    saveCart(cart);

    document.getElementById("cartBtn").innerText="Added to Cart";
    document.getElementById("cartBtn").style.background="gray";

    showToast("Added to Cart 🛒");

    loadProducts();
}

function isInCart(name){
    return getCart().some(i=>i.name===name);
}

// BUY
function buyNow(){
    let orders=JSON.parse(localStorage.getItem("orders"))||[];

    orders.push({...window.selectedProduct,status:"Ordered"});

    localStorage.setItem("orders",JSON.stringify(orders));

    window.location.href="orders.html";
}

// SEARCH
function searchProducts(){
    let val=document.getElementById("searchInput").value.toLowerCase();

    let container=document.getElementById("productContainer");

    let filtered=products.filter(p=>p.name.toLowerCase().includes(val));

    container.innerHTML="";

    if(filtered.length===0){
        container.innerHTML="<h2>Item not available 😔</h2>";
        return;
    }

    filtered.forEach((p,i)=>{
        container.innerHTML+=`
        <div class="product-card" onclick="openProduct(${i})">
            <img src="${p.img}">
            <h3>${p.name}</h3>
            <p class="price">₹${p.price}</p>
            <p class="rating">${getStars(p.rating)}</p>
        </div>`;
    });
}

// TOAST
function showToast(msg){
    let t=document.getElementById("toast");
    t.innerText=msg;
    t.style.display="block";

    setTimeout(()=>t.style.display="none",2000);
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
                    <button onclick="event.stopPropagation(); decreaseQty(${index})">-</button>
                    <span>${item.qty}</span>
                    <button onclick="event.stopPropagation(); increaseQty(${index})">+</button>
                </div>

                <button class="remove" onclick="event.stopPropagation(); removeItem(${index})">
                    Remove
                </button>
            </div>
        </div>`;
    });

    if(totalBox) totalBox.innerText = "Total: ₹" + total;
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

    orders.forEach((item, index) => {

        container.innerHTML += `
        <div class="order-card">
            <img src="${item.img}">

            <div class="order-details">
                <h3>${item.name}</h3>
                <p>${item.desc}</p>
                <p class="price">₹${item.price}</p>

                <div class="status ${item.status.toLowerCase()}">
                    ${item.status}
                </div>
            </div>
        </div>
        `;
    });

    updateOrderStatus();
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


function loadCategoryProducts(){
    let container = document.getElementById("productContainer");
    let title = document.getElementById("catTitle");

    if(!container) return;

    let cat = localStorage.getItem("selectedCategory");

    if(title) title.innerText = cat + " 🛍️";

    let filtered = products.filter(p => p.category === cat);

    container.innerHTML = "";

    if(filtered.length === 0){
        container.innerHTML = "<p>No products found 😔</p>";
        return;
    }

    filtered.forEach((p, index) => {

        container.innerHTML += `
        <div class="product-card ${isInCart(p.name) ? 'in-cart' : ''}" onclick="openProductByName('${p.name}')">
            <img src="${p.img}">
            <h3>${p.name}</h3>
            <p class="price">₹${p.price}</p>
            <p class="rating">${getStars(p.rating)}</p>
        </div>
        `;
    });
}
function goBack(){
    window.location.href = "categories.html";
}


function openProductByName(name){
    let p = products.find(i=>i.name===name);
    window.selectedProduct = p;

    document.getElementById("popupImg").src=p.img;
    document.getElementById("popupName").innerText=p.name;
    document.getElementById("popupDesc").innerText=p.desc;
    document.getElementById("popupPrice").innerText="₹"+p.price;

    document.getElementById("productPopup").style.display="flex";
}

function clearOrders(){
    localStorage.setItem("orders", JSON.stringify([]));
    loadOrders();
    showToast("Orders cleared 🗑️");
}

// LOAD
window.addEventListener("load", function(){

    updateProfile();

    if(document.getElementById("productContainer")){
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

    if(document.getElementById("catTitle")){
        loadCategoryProducts();
    }
});