import { friendlyError } from "../utils/errors";
import { getWhatsAppLink } from "../config";
import { API } from "../api";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API}/api/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.text();

      if (response.ok) {
        const user = JSON.parse(data);

        // Store logged-in user
        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );

        // Go to home
        navigate("/dashboard");

      } else {
        setError(friendlyError(data, "Login failed."));
      }
    } catch (err) {
      setError(
        "Cannot connect to server. Please make sure Spring Boot is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-section">

      <div className="auth-card">

        <div className="auth-icon">
          🎵
        </div>

        <h1>Welcome Back</h1>

        <p className="auth-subtitle">
          Login to continue your learning journey.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Email Address</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="auth-bottom">
          Forgot password?{" "}
          <a
            href={getWhatsAppLink("Hi, I forgot my password. Please help me reset it.")}
            target="_blank"
            rel="noreferrer"
          >
            Message us on WhatsApp
          </a>
        </p>

        <p className="auth-bottom">
          Don't have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>

      </div>

    </section>
  );
}

export default Login;
