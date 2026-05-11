import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  FaHome,
  FaExchangeAlt,
  FaBookOpen,
  FaUsers,
  FaUserCircle,
  FaSignOutAlt
} from "react-icons/fa";

import "../styles/sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    // clear auth if you have (token/localStorage)
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="sidebar">

      <div className="logo-section">
        <div className="logo-icon">✦</div>
        <h2>SkillSwap</h2>
      </div>

      <div className="menu">

        <button
          className={`menu-btn ${isActive("/dashboard") ? "active" : ""}`}
          onClick={() => navigate("/dashboard")}
        >
          <FaHome />
          Dashboard
        </button>

        <button
          className={`menu-btn ${isActive("/skill-exchange") ? "active" : ""}`}
          onClick={() => navigate("/skill-exchange")}
        >
          <FaExchangeAlt />
          Skill Exchange
        </button>

        <button className="menu-btn">
          <FaBookOpen />
          Learning Hub
        </button>

       <button
          className={`menu-btn ${isActive("/community") ? "active" : ""}`}
          onClick={() => navigate("/community")}
        >
          <FaUsers />
          Community
        </button>

        <button
          className={`menu-btn ${isActive("/profile") ? "active" : ""}`}
          onClick={() => navigate("/profile")}
        >
          <FaUserCircle />
          Profile
        </button>
      </div>

      {/* Logout at bottom */}
      <div className="logout-section">
        <button className="menu-btn logout-btn" onClick={handleLogout}>
          <FaSignOutAlt />
          Logout
        </button>
      </div>

    </div>
  );
};

export default Sidebar;