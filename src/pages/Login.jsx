// Login.jsx

import React, { useState } from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import {
  signInWithPopup
} from "firebase/auth";

import {
  auth,
  provider
} from "../firebase";

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

  const handleSubmit = (e) => {

    e.preventDefault();

    const storedUser = JSON.parse(
      localStorage.getItem("user")
    );

    if (
      storedUser?.email ===
      loginData.email
    ) {

      navigate("/dashboard");

    } else {

      alert("Invalid Credentials");
    }
  };

  const handleGoogleLogin = async () => {

    try {

      provider.setCustomParameters({
        prompt: "select_account",
      });

      const result =
        await signInWithPopup(
          auth,
          provider
        );

      const userData = {

        name:
          result.user.displayName,

        email:
          result.user.email,

        photo:
          result.user.photoURL,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      );

      navigate("/dashboard");

    } catch (error) {

      console.log(error);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1>SkillSync</h1>

        <p className="subtitle">
          Welcome back
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={loginData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={loginData.password}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="main-btn"
          >
            Login
          </button>

        </form>

        <div className="divider">
          OR
        </div>

        <button
          type="button"
          className="google-btn"
          onClick={handleGoogleLogin}
        >

          <FcGoogle size={22} />

          Sign in with Google

        </button>

        <p className="bottom-text">

          Don’t have an account?{" "}

          <Link to="/register">
            Register
          </Link>

        </p>

      </div>

    </div>
  );
};

export default Login;