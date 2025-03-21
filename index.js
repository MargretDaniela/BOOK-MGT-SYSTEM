function toggleSidebar() {
    let sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("collapsed");
}
document.addEventListener("DOMContentLoaded", function () {
    const bookList = document.getElementById("bookList");
    const bookForm = document.querySelector(".needs-validation"); 
    const titleInput = document.getElementById("bookTitle");
    const authorInput = document.getElementById("bookAuthor");
    const genreInput = document.getElementById("bookGenre");
    const statusInput = document.getElementById("bookStatus");
    const fileInput = document.getElementById("customFile");

    let books = []; 
    function addBook(event) {
        event.preventDefault(); // Stop page refresh
    
        const title = titleInput.value.trim();
        const author = authorInput.value.trim();
        const genre = genreInput.value.trim();
        const status = statusInput.value;
        const cover = fileInput.files[0] 
            ? URL.createObjectURL(fileInput.files[0]) 
            : "https://via.placeholder.com/150";
    
        if (title && author && genre) {
            books.push({ title, author, genre, status, cover });
    
            // Save the updated books list to local storage
            localStorage.setItem("books", JSON.stringify(books));
    
            displayBooks(); 
            bookForm.reset(); 
            document.querySelector(".btn-close").click();
        } 
        else {
            alert("Please fill in all fields before adding a book.");
        }
    }
    

    function displayBooks() {
        bookList.innerHTML = "";
        books.forEach((book, index) => {
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
                    </div>
                </div>
            `;
    
            bookList.appendChild(card);
        });
    }
    window.onload = function () {
        const storedBooks = localStorage.getItem("books"); // Get saved books
        if (storedBooks) {
            books = JSON.parse(storedBooks); // Convert back to JavaScript object
            displayBooks(); // Show saved books
        }
    };
    window.deleteBook = function (index) {
        books.splice(index, 1); // Remove from list
        localStorage.setItem("books", JSON.stringify(books)); // Update local storage
        displayBooks();
    };


    // Listen for form submission
    bookForm.addEventListener("submit", addBook);
});
