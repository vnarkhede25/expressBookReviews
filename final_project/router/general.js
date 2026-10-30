
const express = require('express');
const axios = require('axios');

const books = require('./booksdb.js');
const { isValid, users } = require('./auth_users.js');

const public_users = express.Router();

// Register a new user
public_users.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: 'Username and password are required'
        });
    }

    if (isValid(username)) {
        return res.status(409).json({
            message: 'Username already exists'
        });
    }

    users.push({ username, password });

    return res.status(201).json({
        message: 'User successfully registered'
    });
});

// Get all books
public_users.get('/', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/books-data');
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving books'
        });
    }
});

// Internal book data route
public_users.get('/books-data', (req, res) => {
    return res.status(200).json(books);
});

// Get book by ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/books-data');
        const book = response.data[req.params.isbn];

        if (!book) {
            return res.status(404).json({
                message: 'Book not found'
            });
        }

        return res.status(200).json(book);
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving book'
        });
    }
});

// Get books by author
public_users.get('/author/:author', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/books-data');
        const allBooks = response.data;
        const author = req.params.author.toLowerCase();

        const result = Object.entries(allBooks)
            .filter(([isbn, book]) =>
                book.author.toLowerCase().includes(author)
            )
            .reduce((found, [isbn, book]) => {
                found[isbn] = book;
                return found;
            }, {});

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            message: 'Error searching by author'
        });
    }
});

// Get books by title
public_users.get('/title/:title', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/books-data');
        const allBooks = response.data;
        const title = req.params.title.toLowerCase();

        const result = Object.entries(allBooks)
            .filter(([isbn, book]) =>
                book.title.toLowerCase().includes(title)
            )
            .reduce((found, [isbn, book]) => {
                found[isbn] = book;
                return found;
            }, {});

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            message: 'Error searching by title'
        });
    }
});

// Get book reviews
public_users.get('/review/:isbn', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/books-data');
        const book = response.data[req.params.isbn];

        if (!book) {
            return res.status(404).json({
                message: 'Book not found'
            });
        }

        return res.status(200).json(book.reviews);
    } catch (error) {
        return res.status(500).json({
            message: 'Error retrieving reviews'
        });
    }
});

module.exports.general = public_users;
