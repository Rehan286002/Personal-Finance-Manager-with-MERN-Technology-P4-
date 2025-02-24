import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    theme: "dark",
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      toast.error("No user found. Please register first.", toastOptions);
      return;
    }

    const user = JSON.parse(storedUser);

    if (credentials.email !== user.email) {
      toast.error("Email not found. Please check your email.", toastOptions);
      return;
    }

    if (credentials.password !== user.password) {
      toast.error("Incorrect password. Please try again.", toastOptions);
      return;
    }

    toast.success("Login successful! Redirecting...", toastOptions);
    localStorage.setItem("authenticated", true);

    setTimeout(() => {
      navigate("/home");
    }, 2000);
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={credentials.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={credentials.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;
