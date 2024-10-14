const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const app = express();
app.use(express.json());
dotenv.config();

const posts = [
  {
    name: "CBIT",
    title: "Welcome to CBIT"
  },
  {
    name: "MGIT",
    title: "Welcome to MGIT"
  }
];

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401); // No token, unauthorized

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => { // Fixed key name
    if (err) {
      return res.sendStatus(403); // Token invalid, forbidden
    }
    req.user = user; // Attach user to request
    next(); // Proceed to next middleware or route handler
  });
};

// Login route to issue a token
app.post('/login', (req, res) => {
  const username = req.body.username;
  const user = { name: username };

  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET); // Fixed key name
  res.json({ accessToken }); // Changed property name to 'accessToken'
});

// Protect posts route with authentication middleware
app.get('/posts', authenticateToken, (req, res) => {
  console.log(req.user.name); // Log the username
  res.json(posts.filter(post => post.name === req.user.name)); // Filter posts by username
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
