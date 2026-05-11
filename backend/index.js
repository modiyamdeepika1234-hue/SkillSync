const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// DB CONNECTION
mongoose.connect("mongodb://localhost:27017/skillsync")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// TEST ROUTE
app.get("/", (req, res) => {
  res.json({ message: "Backend running" });
});


// REGISTER
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, skillsHave } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      skillsHave,
    });

    await newUser.save();

    res.json({ message: "Registered successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.json({
      message: "Login success",
      user: {
        name: user.name,
        email: user.email,
        skillsHave: user.skillsHave,
      },
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// SERVER START
app.listen(5000, () => {
  console.log("Server running on 5000");
});