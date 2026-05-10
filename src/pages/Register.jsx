// Register.jsx

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

const Register = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    skillsHave: "",
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {

    e.preventDefault();

    localStorage.setItem(
      "user",
      JSON.stringify(formData)
    );

    navigate("/dashboard");
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
          Create your account
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          <textarea
            name="skillsHave"
            placeholder="Your Skills"
            value={formData.skillsHave}
            onChange={handleChange}
          ></textarea>

          <button
            type="submit"
            className="main-btn"
          >
            Register
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

          Sign up with Google

        </button>

        <p className="bottom-text">

          Already have an account?{" "}

          <Link to="/login">
            Login
          </Link>

        </p>

      </div>

    </div>
  );
};

export default Register;