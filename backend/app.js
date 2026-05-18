// app.js — Express app: middleware + routes + error handler

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const errorHandler = require('./middleware/errorHandler');

const app = express();


// MIDDLEWARE
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || '*',
  credentials: true
}));

app.use(express.json({
  limit: '2mb'
}));

app.use(morgan('dev'));


// HEALTH ROUTE
app.get('/api/health', (_req, res) => {

  res.json({
    ok: true,
    service: 'SkillSync'
  });

});


// HOME ROUTE
app.get('/', (_req, res) => {

  res.json({
    message: 'Backend running'
  });

});


// REGISTER
app.post('/register', async (req, res) => {

  try {

    const {
      name,
      email,
      password,
      skillsHave
    } = req.body;

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {

      return res.status(400).json({
        message: 'User already exists'
      });

    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      skillsHave
    });

    await newUser.save();

    res.json({
      message: 'Registered successfully'
    });

  } catch (err) {

    res.status(500).json({
      message: 'Server error'
    });

  }

});


// LOGIN
app.post('/login', async (req, res) => {

  try {

    const { email, password } = req.body;

    const user =
      await User.findOne({ email });

    if (!user) {

      return res.status(400).json({
        message: 'User not found'
      });

    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {

      return res.status(400).json({
        message: 'Invalid password'
      });

    }

    res.json({

      message: 'Login success',

      user: {
        name: user.name,
        email: user.email,
        skillsHave: user.skillsHave,
      },

    });

  } catch (err) {

    res.status(500).json({
      message: 'Server error'
    });

  }

});


// UPDATE PROFILE
app.put('/update-profile', async (req, res) => {

  try {

    const {
      email,
      about,
      profilePic,
      teachSkills,
      learnSkills
    } = req.body;

    const updatedUser =
      await User.findOneAndUpdate(

        { email },

        {
          about,
          profilePic,
          teachSkills,
          learnSkills
        },

        { new: true }

      );

    res.json({

      message: 'Profile updated',

      user: updatedUser

    });

  } catch (err) {

    res.status(500).json({
      message: 'Server error'
    });

  }

});


// ROUTES
app.use('/api/auth',
  require('./routes/auth.routes'));

app.use('/api/users',
  require('./routes/user.routes'));

app.use('/api/posts',
  require('./routes/post.routes'));

app.use('/api/connections',
  require('./routes/connection.routes'));

app.use('/api/notifications',
  require('./routes/notification.routes'));

app.use('/api/messages',
  require('./routes/message.routes'));


// ERROR HANDLER
app.use(errorHandler);

module.exports = app;