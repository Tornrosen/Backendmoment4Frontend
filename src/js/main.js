"use strict";

//Skapa variabler
const messageSpace = document.getElementById("messageSpace");
const headMenu = document.getElementById("headMenu");
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const messageForm = document.getElementById("messageForm");
const errorSpace = document.getElementById("errorSpace");

window.onload = init;

function init() {
    changeMenu();
    if(messageSpace) {
        getMessages();
    }
    if(loginForm) {
        loginForm.addEventListener("submit", loginUser)
    }
}

//hämta meddelanden 

async function getMessages() {
    try {
        const response = await fetch("http://127.0.0.1:3000/api/messages")

        if(response.ok) {
            const data = await response.json();
            writeMessages(data);
        }
    } catch {
        console.log("Fel vid datahämtning.")
    }
}

//skriva ut meddelanden

async function writeMessages(data) {
    messageSpace.innerHTML="";
    data.forEach(message => {
       const article = document.createElement("article");
            article.innerHTML += `<h3>${message.title}</h3><p id="msgPoster">${message.username}</p><p>${message.message}.</p>`; 
            messageSpace.appendChild(article);
    });
}

//dynamisk meny

function changeMenu() {
    //localStorage.setItem("user_token", "jdoehf");
    if(localStorage.getItem("user_token")) {
        headMenu.innerHTML =`
        <li><a href="index.html">Meddelanden</a></li>
                    <li><a href="add.html">Lägg till meddelande</a></li>
                    <li><button id="logoutbtn" class="logoutbtn">Logga ut</button></li>`
    } else {
        headMenu.innerHTML = `<li><a href="index.html">Meddelanden</a></li>
                    <li><a href="register.html">Skapa konto</a></li>
                    <li><a href="login.html">Logga in</a></li>`
    }
    const logoutBtn = document.getElementById("logoutbtn");

    if(logoutBtn) {
        logoutBtn.addEventListener("click", ()=> {
            localStorage.removeItem("user_token");
            window.location.href="login.html";
        })
    }
}

async function loginUser (e) {
e.preventDefault();

let usernameValue = document.getElementById("username").value;
let passwordValue = document.getElementById("password").value;

if(!usernameValue||!passwordValue) {
    errorSpace.innerHTML ="Fyll i användarnamn och lösenord!";
    return;
} else {
    errorSpace.innerHTML ="";
}

let user = {
    username: usernameValue,
    password: passwordValue
}

try {
const response = await fetch("http://127.0.0.1:3000/api/login", {
    method: "POST",
    headers: {
        "content-type": "application/json"
    },
    body: JSON.stringify(user)
})
} catch {
    console.log("Felaktigt användarnamn eller lösenord.")
}

}