// Save user's theme choice
let btn = document.querySelector('#theme').addEventListener('click', theme);
const lightMode = document.querySelector('.light');
const darkMode = document.querySelector('dark');
function theme() {
    //console.log("theme works");
    setTheme("light");
}
function setTheme(theme) {
    let inTheme;
    if (inTheme == 'dark') {
        theme = 'light';
        console.log("its light");
    }
    else {
        inTheme= 'light';
        theme = 'dark';
        console.log("its dark");
    }
    localStorage.setItem('userTheme', theme);
    document.body.className = theme;
}

//Load saved theme on page load
//The user's theme preference is being stored, so that when they revisit the site,
//the user won't have to set their theme again. This data is necessary to keep the user's
//preferences and stop them from having to reconfigure their customization each time they visit the website.
//Users could control this data by inspecting the page, clicking the storage tab, and changing the theme value.
window.addEventListener('load', function() {
    const savedTheme = localStorage.getItem('userTheme') || 'light';
    document.body.className = savedTheme;
});