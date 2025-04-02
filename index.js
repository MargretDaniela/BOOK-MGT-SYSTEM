
document.addEventListener("DOMContentLoaded", function () {
    // Get references to form fields and elements
    const bookForm = document.querySelector(".needs-validation");
    const titleInput = document.getElementById("bookTitle");
    const authorInput = document.getElementById("bookAuthor");
    const genreInput = document.getElementById("bookGenre");
    const statusInput = document.getElementById("bookStatus");
    const fileInput = document.getElementById("customFile");
    const saveButton = document.querySelector(".btn-primary"); // Save Button
    const bookList = document.getElementById("bookList");

    // Initialize books array from localStorage or empty array
    let books = JSON.parse(localStorage.getItem("books")) || [];

    // Function to check if all required fields are filled
    function checkInputs() {
        saveButton.disabled = !(
            titleInput.value.trim() &&
            authorInput.value.trim() &&
            genreInput.value.trim()
        );
    }

    // Attach event listeners to form fields
    [titleInput, authorInput, genreInput].forEach(input => {
        input.addEventListener("input", checkInputs);
    });

    // Function to add a new book
    function addBook(event) {
        event.preventDefault(); // Prevent form from refreshing the page

        const title = titleInput.value.trim();
        const author = authorInput.value.trim();
        const genre = genreInput.value.trim();
        const status = statusInput.value;
        const file = fileInput.files[0];

        if (!title || !author || !genre) {
            alert("Please fill in all fields before adding a book.");
            return;
        }

        // Function to save the book in local storage and update the book list
        const saveCover = (cover) => {
            books.push({ title, author, genre, status, cover, favorite: false });
            localStorage.setItem("books", JSON.stringify(books));
            displayBooks(); // Refresh the book list
            bookForm.reset();
            saveButton.disabled = true; // Disable button after saving
            document.querySelector(".btn-close").click(); // Close modal
        };

        if (file) {
            const reader = new FileReader();
            reader.onload = function () {
                saveCover(reader.result); // Use the base64 string for the cover image
            };
            reader.readAsDataURL(file);
        } else {
            saveCover("https://via.placeholder.com/150"); // Default cover if no file is selected
        }
    }

    // Function to display books
    function displayBooks(filteredBooks = books) {
        bookList.innerHTML = ""; // Clear the existing list
        filteredBooks.forEach((book, index) => {
            const card = document.createElement("div");
            card.classList.add("col");
            card.innerHTML = `
                <div class="card h-100">
                    <img src="${book.cover}" class="card-img-top" alt="${book.title}">
                    <div class="card-body">
                        <h5 class="card-title">${book.title}</h5>
                        <p class="card-text">Author: ${book.author}</p>
                        <p class="card-text"><strong>Genre:</strong> ${book.genre}</p>
                        <p class="card-text"><strong>Status:</strong> ${book.status}</p>
                        <button class="btn btn-danger" onclick="deleteBook(${index})">Delete</button>
                        <button class="btn ${book.favorite ? "btn-success" : "btn-warning"}" onclick="toggleFavorite(${index})">
                            ${book.favorite ? "Unfavorite" : "Favorite"}
                        </button>
                    </div>
                </div>
            `;
            bookList.appendChild(card);
        });
    }

    // Function to delete a book
    window.deleteBook = function (index) {
        if (confirm("Are you sure you want to delete this book?")) {
            books.splice(index, 1); // Remove book from the array
            localStorage.setItem("books", JSON.stringify(books)); // Update localStorage
            displayBooks(); // Refresh the book list
        }
    };

    // Function to toggle favorite status of a book
    window.toggleFavorite = function (index) {
        books[index].favorite = !books[index].favorite; // Toggle the favorite status
        localStorage.setItem("books", JSON.stringify(books)); // Save updated list to localStorage
        displayBooks(); // Refresh the book list to show updated favorite status
    };

    // Handle the tab click functionality to filter books
    document.querySelectorAll(".nav-link").forEach(navItem => {
        navItem.addEventListener("click", function (event) {
            const target = event.target.getAttribute("href").substring(1); // Get the target tab's ID
            
            // Filter books based on the tab clicked
            let filteredBooks = [];
            if (target === "allBooks") {
                filteredBooks = books;
            } else if (target === "favorites") {
                filteredBooks = books.filter(book => book.favorite);
            } else if (target === "unfavourite") {
                filteredBooks = books.filter(book => !book.unfavorite);
            } else if (target === "read") {
                filteredBooks = books.filter(book => book.status === "Read");
            } else if (target === "unread") {
                filteredBooks = books.filter(book => book.status === "Unread");
            }

            displayBooks(filteredBooks); // Display the filtered books
        });
    });

    // Initial display of all books
    displayBooks();
    checkInputs(); // Validate inputs on page load

    // Listen for form submission to add a new book
    bookForm.addEventListener("submit", addBook);
});

