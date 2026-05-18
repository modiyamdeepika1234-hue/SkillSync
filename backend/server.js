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
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));
app.use('/api/connections', require('./routes/connection.routes'));
app.use('/api/messages', require('./routes/message.routes'));
app.use('/api/posts', require('./routes/post.routes'));
(async () => {
  await connectDB();
  const server = http.createServer(app);
  initSocket(server);                       // attach websocket layer
  server.listen(PORT, () =>
    console.log(`✅ SkillSync API running on http://localhost:${PORT}`)
  );
})();
