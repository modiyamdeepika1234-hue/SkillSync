// server.js — process entry point.
// Loads env, connects to MongoDB, attaches Socket.IO, starts HTTP server.
require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const initSocket = require('./sockets');
const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.json({
    message: "Backend running",
  });
});
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
(async () => {
  await connectDB();
  const server = http.createServer(app);
  initSocket(server);                       // attach websocket layer
  server.listen(PORT, () =>
    console.log(`✅ SkillSync API running on http://localhost:${PORT}`)
  );
})();
