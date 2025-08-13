require('dotenv').config();
const express = require('express');
const authRoutes = require('../routes/auth.routes');
const promptRoutes = require('../routes/prompt.routes');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session'); // NEW
const app = express();

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
};

app.use(cors(corsOptions));

// Configure and use express-session
app.use(session({
    secret: process.env.SESSION_SECRET, // Make sure to set this in your .env file
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true, // This is crucial for HTTPS on production
        httpOnly: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    },
}));

// Add this root route to prevent "Cannot GET /" error
app.get('/', (req, res) => {
    res.status(200).send('Your PromptVault Backend API is running!');
});

// 2. Parse JSON bodies and cookies
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    req.io = req.app.get('io');
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/prompt', promptRoutes);

module.exports = app;