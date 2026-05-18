const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect("mongodb://modiyamdeepika:deepika1234@ac-qqqsn4k-shard-00-00.vpj6amn.mongodb.net:27017,ac-qqqsn4k-shard-00-01.vpj6amn.mongodb.net:27017,ac-qqqsn4k-shard-00-02.vpj6amn.mongodb.net:27017/?ssl=true&replicaSet=atlas-cct1q6-shard-0&authSource=admin&appName=Cluster0")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));
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
app.put("/update-profile", async (req, res) => {

  try {

    const {
      email,
      about,
      profilePic,
      teachSkills,
      learnSkills,
    } = req.body;

    const updatedUser =
      await User.findOneAndUpdate(
        { email },

        {
          about,
          profilePic,
          teachSkills,
          learnSkills,
        },

        { new: true }
      );

    res.json({
      message:
        "Profile updated",

      user: updatedUser,
    });

  } catch (err) {

    res.status(500).json({
      message:
        "Server error",
    });

  }

});

// SERVER START
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});