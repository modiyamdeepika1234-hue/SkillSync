// Home.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import homeImage from "../home.png";
import "../styles/home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">
          <div className="logo-circle">✦</div>
          <h2>SkillSync</h2>
        </div>

        <div className="nav-right">
          <button className="signin-btn" onClick={() => navigate("/login")}>
            Sign in
          </button>

          <button className="signup-btn" onClick={() => navigate("/register")}>
            Sign up
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="hero">
        {/* LEFT */}
        <div className="hero-left">
          <h1>
            Learn.<span> Teach.</span>
            <br />
            Grow.
          </h1>

          <p>

            Connect with people who want
            to share their skills and learn
            from others in return. No money
            needed, just willingness to
            exchange knowledge.

          </p>

          <div className="hero-buttons">
            <button className="get-btn" onClick={() => navigate("/register")}>
              Get Started
            </button>

            <button className="hero-signin" onClick={() => navigate("/login")}>
              Sign In
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="hero-right">
          <img src={homeImage} alt="home" className="home-image" />
        </div>
      </div>

      {/* HOW IT WORKS SECTION */}
      <div className="works-section">
        <h2>
          How <span>SkillSync</span> Works
        </h2>

        <p className="works-subtitle">
          A simple three-step process to start exchanging skills with like-minded people
        </p>

        <div className="works-cards">

          <div className="work-card">
            <div className="icon blue">👤</div>
            <h3>Create Your Profile</h3>
            <p>List the skills you can teach and what you want to learn.</p>
            <span>Learn more →</span>
          </div>

          <div className="work-card">
            <div className="icon purple">🔍</div>
            <h3>Find Matches</h3>
            <p>Connect with people who have skills you want to learn.</p>
            <span>Learn more →</span>
          </div>

          <div className="work-card">
            <div className="icon pink">⇄</div>
            <h3>Exchange Skills</h3>
            <p>Schedule sessions to teach and learn together easily.</p>
            <span>Learn more →</span>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Home;