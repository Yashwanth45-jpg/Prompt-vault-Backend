// server.js
require('dotenv').config();
const { Server } = require("socket.io");
const app = require('./src/app'); // Your existing Express app
const connectDb = require('./src/db/db');

// Connect to the database first
connectDb();

const PORT = process.env.PORT || 3000;

// 1. Start the Express server and get the http server instance back
const server = app.listen(PORT, () => {
    console.log(`Server Running at Port ${PORT}`);
});

// 2. Create the Socket.IO server using the http server instance
const io = new Server(server, {
  cors: {
    origin: 'https://prompt-vault-frontend-one.vercel.app', // Or your deployed frontend URL
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  }
});

// 3. Attach the 'io' instance to the app object so controllers can access it
app.set('io', io);

// 4. Set up the Socket.IO connection logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});