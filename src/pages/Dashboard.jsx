import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";

import homeImage from "../home.png"; // reuse same image

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="dashboard-main">

        <div className="dashboard-hero">

          <div className="hero-left">

            <h1>
              Welcome to <span>SkillSwap</span>
            </h1>

            <p>
              Learn, teach, and exchange skills with people around you.
              Build your future with collaboration 🚀
            </p>

            <button
              className="get-started-btn"
              onClick={() => navigate("/skill-exchange")}
            >
              Get Started
            </button>

          </div>

          <div className="hero-right">

            <img
              src={homeImage}
              alt="dashboard"
              className="dashboard-image"
            />

          </div>

        </div>

        {/* WORKS SECTION (same as home) */}
        <div className="works-section">

          <h2>
            How it <span>Works</span>
          </h2>

          <div className="works-cards">

            <div className="work-card">
              <h3>Post Skill</h3>
              <p>Share what you can teach or learn.</p>
            </div>

            <div className="work-card">
              <h3>Connect</h3>
              <p>Find people with matching interests.</p>
            </div>

            <div className="work-card">
              <h3>Learn</h3>
              <p>Start exchanging knowledge easily.</p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;