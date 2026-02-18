function signup(){

    let name=document.getElementById("name").value;
    let email=document.getElementById("email").value;
    let password=document.getElementById("password").value;

    if(!name || !email || !password){
        alert("Fill all fields");
        return;
    }

    localStorage.setItem("instaName",name);
    localStorage.setItem("instaPass",password);

    alert("Signup successful! Please login.");
    window.location.href="login.html";
}

function login(){

    let name=document.getElementById("loginName").value;
    let pass=document.getElementById("loginPassword").value;

    let storedName=localStorage.getItem("instaName");
    let storedPass=localStorage.getItem("instaPass");

    if(name===storedName && pass===storedPass){
        alert("Login successful!");
        window.location.href="index.html";
    }else{
        alert("Invalid credentials");
    }
}
