// server.js — process entry point.
// Loads env, connects to MongoDB, attaches Socket.IO, starts HTTP server.
require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const initSocket = require('./sockets');
const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  const server = http.createServer(app);
  initSocket(server);                       // attach websocket layer
  server.listen(PORT, () =>
    console.log(`✅ SkillSync API running on http://localhost:${PORT}`)
  );
})();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});