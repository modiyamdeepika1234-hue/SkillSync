// Socket.IO layer — real-time chat + notification push.
// Auth: client connects with auth.token = <jwt>, we attach socket.userId.
const { Server } = require('socket.io');
const jwt        = require('jsonwebtoken');
const Message    = require('../models/Message');
const Connection = require('../models/Connection');

let io = null;
const onlineUsers = new Map();   // userId -> Set<socketId>

function initSocket(server) {
  io = new Server(server, {
    cors: { origin: process.env.CLIENT_ORIGIN || '*', credentials: true },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('No token'));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (e) { next(new Error('Auth failed')); }
  });

  io.on('connection', (socket) => {
    const uid = socket.userId;
    if (!onlineUsers.has(uid)) onlineUsers.set(uid, new Set());
    onlineUsers.get(uid).add(socket.id);
    io.emit('presence:update', Array.from(onlineUsers.keys()));

    // Send a chat message to a connected user
    socket.on('message:send', async ({ to, text }, ack) => {
      try {
        const connected = await Connection.findOne({
          status: 'accepted',
          $or: [{ requester: uid, receiver: to }, { requester: to, receiver: uid }],
        });
        if (!connected) return ack?.({ error: 'Not connected' });

        const msg = await Message.create({ sender: uid, receiver: to, text });
        emitToUser(to,  'message:new', msg);
        emitToUser(uid, 'message:new', msg);   // echo to sender's other tabs
        ack?.({ ok: true, message: msg });
      } catch (e) { ack?.({ error: e.message }); }
    });

    socket.on('disconnect', () => {
      const set = onlineUsers.get(uid);
      if (set) { set.delete(socket.id); if (!set.size) onlineUsers.delete(uid); }
      io.emit('presence:update', Array.from(onlineUsers.keys()));
    });
  });
}

function emitToUser(userId, event, payload) {
  if (!io) return;
  const sockets = onlineUsers.get(String(userId));
  if (!sockets) return;
  for (const sid of sockets) io.to(sid).emit(event, payload);
}

module.exports = initSocket;
module.exports.emitToUser = emitToUser;
