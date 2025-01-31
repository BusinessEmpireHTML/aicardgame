// A simple Node.js server with Express and Socket.io for future multiplayer support.
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files (HTML, CSS, JS, assets)
app.use(express.static(path.join(__dirname, 'public')));

// Example endpoint for health check or API calls
app.get('/api/status', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Handle Socket.io connections for multiplayer battles
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for battle events (you would add game logic here)
  socket.on('battleMove', (data) => {
    console.log('Battle move:', data);
    // Process battle moves and broadcast updates
    io.emit('battleUpdate', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
