/*
This is a RESTful API server built with Node.js and Express.js that provides endpoints for accessing legal article data stored in a MySQL database. 

The server allows users to retrieve all articles sorted by publication date, filter articles by category, and search articles by a keyword in the title or content. 

This file initializes the server, establishes database connections, defines the API endpoints, and handles HTTP requests and responses.
*/


// Require the necessary modules
const express = require('express');
const mysql = require('mysql');
require('dotenv').config();


// Create an instance of the Express application
const app = express();

// Define the port the server will listen on
const port = 3000;

// Create a connection to the MySQL database
// IMPORTANT ****** -- UPDATE THIS WITH YOUR OWN DATABASE CREDENTIALS -- ****** IMPORTANT
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});


// Connect to the database and log a message if successful
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ' + err.stack);
    return;
  }
  console.log('Connected to database with ID ' + connection.threadId);
});

// Define a route to retrieve all articles from the "articles" table
app.get('/articles', (req, res) => {
  const query = 'SELECT * FROM articles ORDER BY date DESC';
  connection.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(results);
    }
  });
});

// Retrieves articles filtered by category from the database and sends them as a response.
app.get('/articles/category/:category', (req, res) => {
  const category = req.params.category;
  const validCategories = ['Trabalhista', 'Tributário', 'Comercial', 'Penal', 'Constitucional', 'Civil'];

  if (!validCategories.includes(category)) {
    return res.status(400).send({ error: `Invalid category: ${category}` });
  }

  const query = 'SELECT * FROM articles WHERE category = ? ORDER BY date DESC';
  connection.query(query, [category], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(results);
    }
  });
});



// Define a route to search for articles by keyword
app.get('/articles/search/:keyword', (req, res) => {
  const keyword = `%${req.params.keyword}%`;
  const query = 'SELECT * FROM articles WHERE title LIKE ? OR content LIKE ? ORDER BY date DESC';
  connection.query(query, [keyword, keyword], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(results);
    }
  });
});

// Define a route to retrieve articles by author name
app.get('/articles/author/:author', (req, res) => {
  const author = `%${req.params.author}%`;
  const query = 'SELECT * FROM articles WHERE author LIKE ? ORDER BY date DESC';
  connection.query(query, [author], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(results);
    }
  });
});

// Retrieves a single article by its id from the database and sends it as a response.
app.get('/articles/:id', (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM articles WHERE id = ?';
  connection.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else if (results.length === 0) {
      res.status(404).send({ error: `Article with id ${id} not found` });
    } else {
      res.send(results[0]);
    }
  });
});


// Start the server and log a message if successful
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = server;