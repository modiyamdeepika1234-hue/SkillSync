import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import API from "../api";
import { FcGoogle } from "react-icons/fc";
import "../styles/auth.css";

const Login = () => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        // store only user data (not whole response mess)
        localStorage.setItem("user", JSON.stringify(data.user));

        alert("Login successful 🚀");
        navigate("/dashboard");
      } else {
        alert(data.message || "Invalid Credentials");
      }
    } catch (error) {
      console.log(error);
      alert("Server error");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      provider.setCustomParameters({
        prompt: "select_account",
      });

      const result = await signInWithPopup(auth, provider);

      const userData = {
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
      };

      localStorage.setItem("user", JSON.stringify(userData));

      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      alert("Google Login Failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>SkillSync</h1>

        <p className="subtitle">Welcome back</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={loginData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="main-btn">
            Login
          </button>
        </form>

        <div className="divider">OR</div>

        <button
          type="button"
          className="google-btn"
          onClick={handleGoogleLogin}
        >
          <FcGoogle size={22} />
          Sign in with Google
        </button>

        <p className="bottom-text">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;