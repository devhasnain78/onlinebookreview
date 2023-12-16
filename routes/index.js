var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


const books = [
  { id: 1, title: 'The Falling Apart', author: 'Emily Thompson', ISBN: '123456789', reviews: [] },
  { id: 2, title: 'Echoes of Tomorrow', author: 'Benjamin Harper', ISBN: '987654321', reviews: [] },
  { id: 3, title: 'Whispers in the Wind', author: 'Sophia Anderson', ISBN: '345678901', reviews: [] },
  { id: 4, title: 'Midnight Serenade', author: 'William Grant', ISBN: '567890123', reviews: [] },
  { id: 5, title: 'The Enchanted Garden', author: 'Olivia Martinez', ISBN: '789012345', reviews: [] },
];
router.get('/books', (req, res) => {
  res.json(books);
});

router.get('/books/title/:title', (req, res) => {
  const title = req.params.title.toLowerCase(); // Convert to lowercase for case-insensitive search

  // Find books with the specified title
  const matchingBooks = books.filter(book => book.title.toLowerCase().includes(title));

  if (matchingBooks.length === 0) {
    return res.status(404).json({ error: 'No books found with the specified title' });
  }

  res.json(matchingBooks);
});


// Define the route to get books by author
router.get('/books/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase(); // Convert to lowercase for case-insensitive search

  // Find books by the specified author
  const matchingBooks = books.filter(book => book.author.toLowerCase() === author);

  if (matchingBooks.length === 0) {
    return res.status(404).json({ error: 'No books found by the specified author' });
  }

  res.json(matchingBooks);
});

router.get('/books/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  // Find the book with the specified ISBN
  const book = books.find(book => book.ISBN === isbn);

  if (!book) {
    return res.status(404).json({ error: 'No book found with the specified ISBN' });
  }

  // Return the reviews for the book
  res.json(book.reviews);
});
// Define the route to get books based on ISBN
router.get('/books/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  // Find books with the specified ISBN
  const matchingBooks = books.filter(book => book.ISBN === isbn);

  if (matchingBooks.length === 0) {
    return res.status(404).json({ error: 'No books found with the specified ISBN' });
  }

  res.json(matchingBooks);
});
const users = [
  { username: 'user1', password: 'password1' },
  { username: 'user2', password: 'password2' },
  // Add more user data as needed
];
// Define the route to register a new user
router.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Validate if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Check if the username is already taken
  if (users.some(user => user.username === username)) {
    return res.status(409).json({ error: 'Username is already taken' });
  }

  // Create a new user
  const newUser = { username, password };
  users.push(newUser);

  res.status(201).json({ message: 'User registered successfully', user: newUser });
});


// Define the route to log in as a registered user
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Validate if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Check if the provided username and password match any registered user
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  res.status(200).json({ message: 'Login successful', user });
});

router.post('/books/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const { username, review } = req.body;

  // Validate if username and review are provided
  if (!username || !review) {
    return res.status(400).json({ error: 'Username and review are required' });
  }

  // Find the book with the specified ISBN
  const book = books.find(book => book.ISBN === isbn);

  if (!book) {
    return res.status(404).json({ error: 'No book found with the specified ISBN' });
  }

  // Check if the user has already left a review
  const existingReviewIndex = book.reviews.findIndex(r => r.username === username);

  // If the user has left a review, modify it; otherwise, add a new review
  if (existingReviewIndex !== -1) {
    book.reviews[existingReviewIndex].review = review;
  } else {
    book.reviews.push({ username, review });
  }

  res.status(200).json({ message: 'Review added or modified successfully', book });
});

router.delete('/books/review/:isbn/:username', (req, res) => {
  const isbn = req.params.isbn;
  const username = req.params.username;

  // Find the book with the specified ISBN
  const book = books.find(book => book.ISBN === isbn);

  if (!book) {
    return res.status(404).json({ error: 'No book found with the specified ISBN' });
  }

  // Check if the user has left a review
  const existingReviewIndex = book.reviews.findIndex(r => r.username === username);

  if (existingReviewIndex === -1) {
    return res.status(404).json({ error: 'No review found for the specified user' });
  }

  // Remove the review from the array
  book.reviews.splice(existingReviewIndex, 1);

  res.status(200).json({ message: 'Review deleted successfully', book });
});

router.get('/books/async', async (req, res) => {
  try {
    // Simulate an asynchronous operation, e.g., querying a database
    const getAllBooksAsync = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(books);
        }, 1000); // Simulating a delay of 1 second
      });
    };

    const allBooks = await getAllBooksAsync();

    res.json(allBooks);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});




module.exports = router;
