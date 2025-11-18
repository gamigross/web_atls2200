document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput")
  const searchButton = document.getElementById("searchButton")
  const sortFilter = document.getElementById("sortFilter")
  const hasCoverFilter = document.getElementById("hasCoverFilter")
  const resultsContainer = document.getElementById("results-container")
  const loaderContainer = document.getElementById("loader-container")
  const resultsTitle = document.getElementById("results-title")
  const modalBackdrop = document.getElementById("modal-backdrop")
  const modalCloseBtn = document.getElementById("modal-close-btn")
  const modalBody = document.getElementById("modal-body")

//create array for api data to be pushed to
  let currentResults = []

//keyboard accessibility
  searchButton.addEventListener("click", handleSearchTrigger)
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSearchTrigger()
  })
  sortFilter.addEventListener("change", () => displayResults(currentResults))
  hasCoverFilter.addEventListener("change", () => displayResults(currentResults))
  modalCloseBtn.addEventListener("click", closeModal)
  modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) closeModal()
  })

  fetchFeaturedBooks()

  function handleSearchTrigger() {
    const query = searchInput.value.trim()
    if (query) {
      resultsTitle.textContent = `Results for "${query}"`
      performSearch(query)
    } else {
      resultsTitle.textContent = "Featured Books"
      fetchFeaturedBooks()
    }
  }

  async function performSearch(query) {
    showLoader(12)
    resultsContainer.innerHTML = ""
    try {
      const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`)
      if (!response.ok) throw new Error("Network response was not ok")
      const data = await response.json()
      currentResults = data.docs
      displayResults(currentResults)
    } catch (error) {
      handleError(error)
    }
  }

  async function fetchFeaturedBooks() {
    showLoader(12)
    resultsContainer.innerHTML = ""
    try {
      const response = await fetch(`https://openlibrary.org/search.json?q=popular+classic+literature&limit=12`)
      if (!response.ok) throw new Error("Network response was not ok")
      const data = await response.json()
      currentResults = data.docs
      displayResults(currentResults)
    } catch (error) {
      handleError(error)
    }
  }

  function displayResults(books) {
    loaderContainer.innerHTML = ""
    resultsContainer.innerHTML = ""

    let filteredBooks = books
    if (hasCoverFilter.checked) {
      filteredBooks = books.filter((book) => book.cover_i)
    }

    if (filteredBooks.length === 0) {
      resultsContainer.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">No results found.</p>'
      return
    }

    const sortedBooks = sortBooks(filteredBooks)
    sortedBooks.forEach((book) => createBookCard(book))
  }

  function createBookCard(book) {
    const title = book.title || "Title Unknown"
    const coverId = book.cover_i
    const coverUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : "nocover.png"

    const bookCard = document.createElement("div")
    bookCard.className = "book-card"
    bookCard.innerHTML = `
      <img class="book-cover" src="${coverUrl}" alt="${title} cover art" loading="lazy" onerror="this.onerror=null;this.src='nocover.png';">
      <div class="book-card-content">
        <h3>${title}</h3>
        <p>${book.author_name ? book.author_name.join(", ") : "Author Unknown"}</p>
      </div>
    `
    bookCard.addEventListener("click", () => openModal(book))
    resultsContainer.appendChild(bookCard)
  }

  async function openModal(book) {
    modalBody.innerHTML = '<p class="loading-text">loading book details...</p>'
    modalBackdrop.classList.remove("hidden")

    const coverUrl = book.cover_i
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
      : "nocover.png"
    const title = book.title || "Title Unknown"
    const author = book.author_name ? book.author_name.join(", ") : "Author Unknown"
    const publishYear = book.first_publish_year || "Unknown"
    const publisher = book.publisher ? book.publisher[0] : "Unknown"
    const pages = book.number_of_pages_median || "Unknown"
    const bookLink = `https://openlibrary.org${book.key}`

    let description = "No description found."
    try {
      const workResponse = await fetch(`https://openlibrary.org${book.key}.json`)
      if (workResponse.ok) {
        const workData = await workResponse.json()
        if (typeof workData.description === "string") {
          description = workData.description
        } else if (workData.description && typeof workData.description.value === "string") {
          description = workData.description.value
        }
      }
    } catch (e) {
      console.error("Error fetching description:", e)
    }

    modalBody.innerHTML = `
      <img src="${coverUrl}" alt="${title} cover">
      <div class="modal-details">
        <h2>${title}</h2>
        <p>by ${author}</p>
        <div class="meta-info">
          <span><strong>First Published:</strong> ${publishYear}</span>
          <span><strong>Publisher:</strong> ${publisher}</span>
          <span><strong>Page Count:</strong> ${pages}</span>
        </div>
        <div class="description">
          <strong>Description:</strong>
          <p class="description-text">${description.substring(0, 400)}${description.length > 400 ? "..." : ""}</p>
        </div>
        <a href="${bookLink}" target="_blank">View on Open Library</a>
      </div>
    `
  }

  function closeModal() {
    modalBackdrop.classList.add("hidden")
  }

  function sortBooks(books) {
    const sortBy = sortFilter.value
    return [...books].sort((a, b) => {
      if (sortBy === "newest") return (b.first_publish_year || 0) - (a.first_publish_year || 0)
      if (sortBy === "oldest") return (a.first_publish_year || 0) - (b.first_publish_year || 0)
      return 0
    })
  }

  function showLoader(count) {
    loaderContainer.innerHTML = ""
    for (let i = 0; i < count; i++) {
      const skeletonCard = document.createElement("div")
      skeletonCard.className = "skeleton-card shimmer"
      skeletonCard.innerHTML = `
        <div class="skeleton-cover"></div>
        <div class="skeleton-text"></div>
        <div class="skeleton-text short"></div>
      `
      loaderContainer.appendChild(skeletonCard)
    }
  }

  function handleError(error) {
    console.error("Error:", error)
    loaderContainer.innerHTML = ""
    resultsContainer.innerHTML = '<p style="text-align: center;">An error occurred. Please try again later.</p>'
  }
})