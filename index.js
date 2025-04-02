// Toggle Sidebar Function
function toggleSidebar() {
    let sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("collapsed");
}

document.addEventListener("DOMContentLoaded", function () {
    const bookForm = document.querySelector(".needs-validation");
    const titleInput = document.getElementById("bookTitle");
    const authorInput = document.getElementById("bookAuthor");
    const genreInput = document.getElementById("bookGenre");
    const statusInput = document.getElementById("bookStatus");
    const fileInput = document.getElementById("customFile");
    const saveButton = document.querySelector(".btn-primary");
    const bookList = document.getElementById("bookList");

    let books = JSON.parse(localStorage.getItem("books")) || [];

    function checkInputs() {
        saveButton.disabled = !(
            titleInput.value.trim() &&
            authorInput.value.trim() &&
            genreInput.value.trim()
        );
    }

    [titleInput, authorInput, genreInput].forEach(input => {
        input.addEventListener("input", checkInputs);
    });

    function addBook(event) {
        event.preventDefault();

        const title = titleInput.value.trim();
        const author = authorInput.value.trim();
        const genre = genreInput.value.trim();
        const status = statusInput.value;
        const file = fileInput.files[0];

        if (!title || !author || !genre) {
            alert("Please fill in all fields before adding a book.");
            return;
        }

        const saveCover = (cover) => {
            books.push({ title, author, genre, status, cover, favorite: false });
            localStorage.setItem("books", JSON.stringify(books));
            displayBooks();
            bookForm.reset();
            saveButton.disabled = true;
            document.querySelector(".btn-close").click();
        };

        if (file) {
            const reader = new FileReader();
            reader.onload = function () {
                saveCover(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            saveCover("https://via.placeholder.com/150");
        }
    }

    function displayBooks(filteredBooks = books) {
        bookList.innerHTML = "";
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
                        <button class="btn btn-primary" onclick="editBook(${index})">Edit</button> <!-- Edit Button -->
                    </div>
                </div>
            `;
            bookList.appendChild(card);
        });
    }
    function editBook(index) {
        const book = books[index];
        // Pre-fill the form with the book's current data
        document.getElementById("bookTitle").value = book.title;
        document.getElementById("bookAuthor").value = book.author;
        document.getElementById("bookGenre").value = book.genre;
        document.getElementById("bookStatus").value = book.status;
        // Show the modal
        const modal = new bootstrap.Modal(document.getElementById("exampleModalCenter"));
        modal.show();
    
        // Handle the form submission to update the book data
        document.querySelector(".needs-validation").onsubmit = function (event) {
            event.preventDefault();
    
            // Update the book information
            book.title = document.getElementById("bookTitle").value;
            book.author = document.getElementById("bookAuthor").value;
            book.genre = document.getElementById("bookGenre").value;
            book.status = document.getElementById("bookStatus").value;
    
            // Save updated book list to localStorage
            localStorage.setItem("books", JSON.stringify(books));
    
            // Refresh the book list display
            displayBooks();
    
            // Close the modal
            modal.hide();
        };
    }
    

    window.deleteBook = function (index) {
        if (confirm("Are you sure you want to delete this book?")) {
            books.splice(index, 1);
            localStorage.setItem("books", JSON.stringify(books));
            displayBooks();
        }
    };

    window.toggleFavorite = function (index) {
        books[index].favorite = !books[index].favorite;
        localStorage.setItem("books", JSON.stringify(books));
        displayBooks();
    };

    document.querySelectorAll(".nav-link").forEach(navItem => {
        navItem.addEventListener("click", function (event) {
            event.preventDefault();
            document.querySelectorAll(".nav-link").forEach(link => link.classList.remove("active"));
            this.classList.add("active");
            const target = this.getAttribute("href").substring(1);
            let filteredBooks = books;

            if (target === "favorites") {
                filteredBooks = books.filter(book => book.favorite);
            } else if (target === "unfavourite") {
                filteredBooks = books.filter(book => !book.unfavorite);
            } else if (target === "read") {
                filteredBooks = books.filter(book => book.status === "Read");
            } else if (target === "unread") {
                filteredBooks = books.filter(book => book.status === "Unread");
            }

            displayBooks(filteredBooks);
        });
    });

    displayBooks();
    checkInputs();
    bookForm.addEventListener("submit", addBook);
});

