const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu'); 

function showMenu() {
    var shown = navMenu.classList.toggle("show");
    navMenu.classList.toggle("hide");
    console.log("clicked");

    if (shown) {
        navToggle.setAttribute("aria-expanded", "true");
        navToggle.style.transform = "rotate(270deg)"
        
    }
    else {
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.style.transform = "rotate(0deg)"
    }
}

function checkKey(key_code) {
    if (key_code == 32) {
        showMenu();
        console.log("space pressed");
    }
}

navToggle.addEventListener('click', showMenu);