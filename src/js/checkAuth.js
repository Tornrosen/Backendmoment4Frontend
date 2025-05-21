"use strict";

if(!localStorage.getItem("user_token")) {
    window.location.href = "login.html";
}