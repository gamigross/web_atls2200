// Save user's theme choice
let btn = document.querySelector('#theme').addEventListener('click', theme);

function theme() {
    //console.log("theme works");
    setTheme("light");
}
function setTheme(theme) {
    let inTheme = "light";
    if (inTheme == 'dark') {
        theme = 'light';
    }
    else {
        theme = 'dark';
    }
    localStorage.setItem('userTheme', theme);
    document.body.className = theme;
}

// Load saved theme on page load
window.addEventListener('load', function() {
    const savedTheme = localStorage.getItem('userTheme') || 'light';
    document.body.className = savedTheme;
});