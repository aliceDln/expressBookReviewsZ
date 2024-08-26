const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// görev 6
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // Add the new user to the users array
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop görev 1
public_users.get('/', function (req, res) {
  const booksList = JSON.stringify(books);
  return res.status(200).json(booksList);
});

// Get book details based on ISBN görev 2
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});
  
// Get book details based on author görev 3
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter(book => book.author === author);

  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({ message: "No books found by this author" });
  }
});

// Get all books based on title görev 4
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();
  const booksByTitle = Object.values(books).filter(book => book.title.toLowerCase() === title);

  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

//  Get book review görev 5
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book && book.review) {
    return res.status(200).json(book.review);
  } else if (book) {
    return res.status(404).json({ message: "No review found for this book" });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
