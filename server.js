// require('dotenv').config();
// import { listen } from './src/app';
// import connectDb from './src/db/db';


// connectDb();
// //creating a server
// listen(3000, ()=>{
//     console.log('Server Running at Port 3000')
// })
// server.js

require('dotenv').config();
const http = require('http');
const { Server } = require("socket.io");
const app = require('./src/app'); // Your existing app
const connectDb = require('./src/db/db');

connectDb();

// Create the HTTP server and the Socket.IO server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL, // Your frontend URL
    methods: ["GET", "POST", "PUT"]
  }
});

// Attach the 'io' instance to the app object so it can be accessed in your controllers
app.set('io', io);

// --- Socket.IO connection logic ---
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server Running at Port ${PORT}`);
});