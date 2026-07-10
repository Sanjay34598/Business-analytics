import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Temporary login (later connect to backend)
    if (email && password) {
      navigate("/dashboard");
    } else {
      alert("Please enter email and password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-left">
          <h1>AI Business Consultant</h1>
          <p>
            Analyze your business with AI-powered insights, sales forecasting,
            customer analytics, inventory management, and reports.
          </p>
        </div>

        <div className="login-right">
          <h2>Welcome Back</h2>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">Login</button>
          </form>

          <p className="footer-text">
            AI Business Consultant © 2026
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;