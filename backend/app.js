// app.js — Express app: middleware + route mounting + error handler.
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*', credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'SkillSync' }));

app.use('/api/auth',          require('./routes/auth.routes'));
app.use('/api/users',         require('./routes/user.routes'));
app.use('/api/posts',         require('./routes/post.routes'));
app.use('/api/connections',   require('./routes/connection.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));
app.use('/api/messages',      require('./routes/message.routes'));

app.use(errorHandler);
module.exports = app;
