// Import Express module
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse incoming JSON data
app.use(express.json());

// ======================
// In-Memory User Storage
// ======================
let users = [
  {
    id: "1",
    firstName: "Karan",
    lastName: "Kumar",
    hobby: "Coding"
  },
  {
    id: "2",
    firstName: "John",
    lastName: "Doe",
    hobby: "Reading"
  },
  {
    id: "3",
    firstName: "Jane",
    lastName: "Smith",
    hobby: "Hiking"
  },
  {
    id: "4",
    firstName: "Alice",
    lastName: "Johnson",
    hobby: "Photography"
  },
  {
    id: "5",
    firstName: "Bob",
    lastName: "Brown",
    hobby: "Cooking"
  }
];

// ======================
// Logging Middleware
// Logs method, URL, and status code for each request
// ======================
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} => ${res.statusCode}`);
  });
  next();
});

// ======================
// Validation Middleware
// Checks that firstName, lastName, and hobby are provided
// ======================
const validateUser = (req, res, next) => {
  const { firstName, lastName, hobby } = req.body;

  if (!firstName || !lastName || !hobby) {
    return res.status(400).json({
      error: "Validation failed. 'firstName', 'lastName', and 'hobby' are required."
    });
  }

  next();
};

// ======================
// API Routes
// ======================

// GET all users
app.get('/users', (req, res) => {
  res.status(200).json(users);
});

// GET a specific user by ID
app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json(user);
});

// POST a new user
app.post('/user', validateUser, (req, res) => {
  const newUser = {
    id: (users.length + 1).toString(), // Generate new ID as string
    ...req.body
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT (update) an existing user
app.put('/user/:id', validateUser, (req, res) => {
  const userIndex = users.findIndex(u => u.id === req.params.id);

  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  // Update user with new data
  users[userIndex] = { id: req.params.id, ...req.body };
  res.status(200).json(users[userIndex]);
});

// DELETE a user by ID
app.delete('/user/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === req.params.id);

  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  const deletedUser = users.splice(userIndex, 1);
  res.status(200).json({ message: "User deleted", user: deletedUser[0] });
});

// Home route to handle root URL
app.get('/', (req, res) => {
  res.send("👋 Welcome to the User API! Use /users, /user/:id endpoints to interact.");
});


// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

