const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu'); 
//These are the variables for the interactive form selecting the form class plus name and email IDs.
document.addEventListener('DOMContentLoaded', function(){
//^ everything needs to be contained in this event listener for when the form is submitted.
//This event fires when the page is processed. Without this event listener,
//the user gets a 404 error message after pressing submit on the form.
const form = document.querySelector('.register-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');

//Real-time validation
emailInput.addEventListener('blur', function() {
    validateEmail(emailInput);
});

//Form submission
form.addEventListener("submit", function(event) {
    let isValid = true;

//Validate all fields before submission by calling functions defined further down. 
//The preventDefault method prevents the user from submitting the form blank or without the requirements laid out in the validation functions.
    if (!validateName(nameInput)) isValid = false;
    if (!validateEmail(emailInput)) isValid = false;

    if (!isValid) {
      event.preventDefault();
    }
});

//These functions lay out requirements for the form field submissions.
//If the email address doesn't have an @, you cannot submit the form. An error will pop up on screen so the user
//knows what mistake they made. The error function is defined further down.
function validateEmail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.value.trim())) {
      showError(input, 'Please enter a valid email address');
      return false;
    } else {
      removeError(input);
      return true;
    }
}
});

//The showError function has two parameters. When called, it takes an input and displays the error message
//typed into the second parameter typed when the function is declared.
function showError(input, message) {
//The classList.add method creates an input-error class which is removed later in the removeError function.
//This means that the error messages can be removed if fixed or updated if a new error occurs.
    input.classList.add('input-error');

//Remove any existing error message
    const existingError = input.nextElementSibling;
    if (existingError && existingError.classList.contains('error-message')) {
      existingError.remove();
    }

//Create and insert error message as a div which appears below the form entry box
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerText = message;
    input.parentNode.insertBefore(errorDiv, input.nextElementSibling);
}

function removeError(input) {
    input.classList.remove('input-error');

    //Remove error message if it exists
    const existingError = input.nextElementSibling;
    if (existingError && existingError.classList.contains('error-message')) {
      existingError.remove();
    }
}

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