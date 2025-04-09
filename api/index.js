const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const User = require('./models/tempUser.js'); // Adjust this to the correct path
require('dotenv').config();

const app = express();
const bcryptSalt = bcrypt.genSaltSync(10);

// Middleware
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'  // Allow requests from your frontend's URL
}));

// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Test route to check server
app.get('/test', (req, res) => {
    res.json('test ok');
});

// Register route
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userDoc = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt),
        });
        res.json({ userDoc });
    } catch (e) {
        res.status(422).json(e);
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });
    if (userDoc) {
        // Compare passwords using bcrypt
        const isPasswordValid = bcrypt.compareSync(password, userDoc.password);
        if (isPasswordValid) {
            res.json('Login successful');
        } else {
            res.json('Invalid password');
        }
    } else {
        res.json('User not found');
    }
});

// Start server
app.listen(4000, () => {
    console.log('Server is running on http://localhost:4000');
});



// const express = require('express');
// const cors = require('cors');
// const mongoose = require("mongoose");
// const bcrypt = require('bcryptjs');
// require('dotenv').config();
// const User = require('./models/tempUser.js'); 


// const app = express();
// const bcryptSalt = bcrypt.genSaltSync(10);

// // Middleware
// app.use(express.json());
// app.use(cors({
//     credentials: true,
//     origin: 'http://localhost:5173',
// }));

// // MongoDB Connection
// mongoose.connect(process.env.MONGO_URL)
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.error('MongoDB connection error:', err));

// // Test route
// app.get('/test', (req, res) => {
//     res.json('test ok');
// });

// // Register route
// app.post('/register', async (req, res) => {
//     const { name, email, password } = req.body;
//     try {
//         const userDoc = await User.create({
//             name,
//             email,
//             password: bcrypt.hashSync(password, bcryptSalt),
//         });
//         res.json({ userDoc });
//     } catch (e) {
//         console.error(e);
//         res.status(422).json(e);
//     }
// });

// // Start server
// app.listen(4000, () => {
//     console.log('Server is running on http://localhost:4000');
// });
