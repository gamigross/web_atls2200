const quoteText = document.getElementById("quote");
const quoteAuthor = document.getElementById("author");
const button = document.getElementById("new-quote");

function getQuote() {
  fetch("https://dummyjson.com/quotes") // plural 'quotes'
    .then((response) => response.json())
    .then((data) => {
      const quotes = data.quotes;
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const randomQuote = quotes[randomIndex];

      quoteText.textContent = `"${randomQuote.quote}"`;
      quoteAuthor.textContent = `– ${randomQuote.author}`;
    })
    .catch((error) => {
      quoteText.textContent = "Error fetching quote.";
      quoteAuthor.textContent = "";
      console.error(error);
    });
}

button.addEventListener("click", getQuote);

// Load initial quote
getQuote();

document.querySelectorAll(".copy").forEach(copyButton => {
    copyButton.addEventListener("click", () => {
        const targetElement = document.querySelector(copyButton.dataset.copy);
        const textToCopy = targetElement.textContent;

        //console.log(textToCopy);
        navigator.clipboard.writeText(textToCopy).then(() => {
            const label = copyButton.querySelector(".copy");
            copyButton.textContent="Copied!";
            setTimeout(() => {
                copyButton.textContent="Copy To Clipboard";
            }, 1000);
        })
    })
})