
// Toggle Sidebar Function
function toggleSidebar() {
    let sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("collapsed");
}
// Declare books globally at the top
let books = JSON.parse(localStorage.getItem("books")) || []; 

document.addEventListener("DOMContentLoaded", function () {
  // Function to create a book card
  function createBookCard(book) {
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
          <button class="btn btn-danger" onclick="deleteBook(${book.id})">Delete</button>
          <button class="btn ${book.favorite ? "btn-success" : "btn-warning"}" onclick="toggleFavorite(${book.id})">
            ${book.favorite ? "Unfavorite" : "Favorite"}
          </button>
          <button class="btn btn-primary" onclick="editBook(${book.id})">Edit</button>
        </div>
      </div>
    `;
    return card;
  }

  // Function to display books
  function displayBooks(filteredBooks = books) {
    const bookList = document.getElementById("bookList");
    bookList.innerHTML = ""; // Clear current list

    filteredBooks.forEach(book => {
      bookList.appendChild(createBookCard(book));
    });
  }

  // Function to search books based on input
  function searchBooks(input) {
    let query = input.value.toLowerCase().trim();
    // Filter books based on the query
    let filteredBooks = books.filter(book => 
      book.title.toLowerCase().includes(query) || 
      book.author.toLowerCase().includes(query)
    );

    // Clear and update book list with search results
    let bookList = document.getElementById("bookList");
    bookList.innerHTML = ""; // Clear current list

    filteredBooks.forEach(book => {
      bookList.appendChild(createBookCard(book));
    });

    // If no books match, show a "No results found" message
    if (filteredBooks.length === 0) {
      bookList.innerHTML = `<p class="text-center text-muted">No books found</p>`;
    }
  }

  // Add event listener to search input field for live filtering
  const searchInput = document.querySelector(".search-input");
  searchInput.addEventListener("input", function () {
    searchBooks(this);
  });

});


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
    let isEditing = false;
    let editingIndex = -1;

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
            if (isEditing && editingIndex > -1) {
                books[editingIndex] = { 
                    ...books[editingIndex], 
                    title, 
                    author, 
                    genre, 
                    status, 
                    cover 
                };
            } else {
                books.push({ title, author, genre, status, cover, favorite: false });
            }

            localStorage.setItem("books", JSON.stringify(books));
            displayBooks();
            bookForm.reset();
            saveButton.disabled = true;
            document.querySelector(".btn-close").click();

            isEditing = false;
            editingIndex = -1;
        };

        if (file) {
            const reader = new FileReader();
            reader.onload = function () {
                saveCover(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            const existingCover = isEditing ? books[editingIndex].cover : "https://via.placeholder.com/150";
            saveCover(existingCover);
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
                        <button class="btn btn-primary" onclick="editBook(${index})">Edit</button>
                    </div>
                </div>
            `;
            bookList.appendChild(card);
        });
    }
    window.editBook = function (index) {
        const book = books[index];

        isEditing = true;
        editingIndex = index;

        document.getElementById("bookTitle").value = book.title;
        document.getElementById("bookAuthor").value = book.author;
        document.getElementById("bookGenre").value = book.genre;
        document.getElementById("bookStatus").value = book.status;

        const modal = new bootstrap.Modal(document.getElementById("exampleModalCenter"));
        modal.show();
    };
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
                filteredBooks = books.filter(book => !book.favorite);
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

