// app.js

require('dotenv').config();
const express =  require('express');
const authRoutes = require('../routes/auth.routes');
const promptRoutes = require('../routes/prompt.routes');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

const corsOptions = {
    origin: process.env.FRONTEND_URL, 
    credentials: true,
};


app.use(cors(corsOptions));

// 2. Parse JSON bodies and cookies so they are available in subsequent middleware and routes.
app.use(express.json());
app.use(cookieParser());

// Add this root route here
app.get('/', (req, res) => {
  res.status(200).send('Your PromptVault Backend API is running!');
});

app.use((req, res, next) => {
    // Pull the 'io' instance from the app object where we attached it
    req.io = req.app.get('io');
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/prompt', promptRoutes);

module.exports = app;