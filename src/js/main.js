"use strict";

//Skapa variabler
const messageSpace = document.getElementById("messageSpace");
const headMenu = document.getElementById("headMenu");
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
let messageForm = document.getElementById("messageForm");
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

    if(messageForm) {
        messageForm.addEventListener("submit", submitMessage)
    }

}

//hämta meddelanden 

async function getMessages() {
    try {
        const response = await fetch("http://127.0.0.1:3000/messages")

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
            article.innerHTML += `<h3>${message.username}</h3><p>${message.message}.</p>`; 
            messageSpace.appendChild(article);
    });
}

//dynamisk meny

function changeMenu() {
    
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

//logga in användare
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
const response = await fetch("http://127.0.0.1:3000/login", {
    method: "POST",
    headers: {
        "content-type": "application/json"
    },
    body: JSON.stringify(user)
})
if(response.ok) {
    const data = await response.json();
    localStorage.setItem("user_token", data.token);
    window.location.href="add.html";
} else {
    throw error;
}
} catch {
    console.log("Felaktigt användarnamn eller lösenord.")
}

}

//lägga till meddelande 

async function submitMessage(e) {
    e.preventDefault();

let usernameValue = document.getElementById("username").value;
let messageValue = document.getElementById("message").value;

if(!usernameValue||!messageValue) {
    errorSpace.innerHTML ="Fyll i användarnamn och meddelande!";
    return;
} else {
    errorSpace.innerHTML ="";
}

let message = {
    username: usernameValue,
    message: messageValue
}

const token = localStorage.getItem("user_token");

try {
const response = await fetch("http://127.0.0.1:3000/messages", {
    method: "POST",
    headers: {
        "content-type": "application/json",
        "authorization": "Bearer " + token
    },
    body: JSON.stringify(message)
})
if(response.ok) {
    const data = await response.json();
    let msgSpace = document.getElementById("msgSpace");
    msgSpace.innerHTML =`Meddelande från användare titeln ${data.username} har blivit tillagt!`;
} else {
    msgSpace.innerHTML="";
    throw error;
}
} catch {
    console.log("Kunde inte lägga till meddelande.")
}

}