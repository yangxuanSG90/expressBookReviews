const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }
  

public_users.post("/register", (req,res) => {
    
        const username = req.body.username;
        const password = req.body.password;
      
        if (username && password) {
          if (!doesExist(username)) { 
            users.push({"username":username,"password":password});
            return res.status(200).json({message: "Book Review User successfully registered. Now you can login"});
          } else {
            return res.status(404).json({message: "User already exists!"});    
          }
        } 
        return res.status(404).json({message: "Unable to register user. Missing username &/ password"});
});

// Get the book list available in the shop

public_users.get('/',function (req, res) {
    res.send(JSON.stringify({books}, null, 4));
  });


// Get book details based on ISBN
// TASK 11 - Get book details based on ISBN using Promises
public_users.get('/books/isbn/:isbn',function (req, res) {
    const get_books_isbn = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    // console.log(isbn);
        if (req.params.isbn <= 10) {
        resolve(res.send(books[isbn]));
    }
        else {
            reject(res.send('ISBN not found'));
        }
    });
    get_books_isbn.
        then(function(){
            console.log("Promise for Task 11 is resolved");
   }).
        catch(function () { 
                console.log('ISBN not found');
  });

});
  
// Get book details based on author
// TASK 12 - Get book details based on author
public_users.get('/books/author/:author',function (req, res) {

    const get_books_author = new Promise((resolve, reject) => {

    let booksbyauthor = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn]["author"] === req.params.author) {
        booksbyauthor.push({"isbn":isbn,
                            "title":books[isbn]["title"],
                            "reviews":books[isbn]["reviews"]});
      resolve(res.send(JSON.stringify({booksbyauthor}, null, 4)));
      }


    });
    reject(res.send("The mentioned author does not exist "))
        
    });

    get_books_author.then(function(){
            console.log("Promise is resolved");
   }).catch(function () { 
                console.log('The mentioned author does not exist');
  });

  });


// Get all books based on title
public_users.get('/title/:title',function (req, res) {

    const get_books_title = new Promise((resolve, reject) => {
        
    let booksbytitle = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn]["title"] === req.params.title) {
        booksbytitle.push({"isbn":isbn,
                            "title":books[isbn]["title"],
                            "reviews":books[isbn]["reviews"]});
      }
    });
    res.send(JSON.stringify({booksbytitle}, null, 4));
});
    reject(res.send("The mentioned title does not exist "))
    
});

get_books_title.then(function(){
        console.log("Promise is resolved");
}).catch(function () { 
            console.log('The mentioned title does not exist');
});



//  Get book review

const axios = require('axios');

public_users.get('/books', function (req, res) {
    axios.get('http://your-api-url/books')
        .then(response => {
            res.send(JSON.stringify(response.data.books, null, 4));
            console.log("Promise for Task 10 resolved");
        })
        .catch(error => {
            // Handle error
            console.error('Error fetching books:', error);
            res.status(500).send('Error fetching books');
        });
});

module.exports.general = public_users;
