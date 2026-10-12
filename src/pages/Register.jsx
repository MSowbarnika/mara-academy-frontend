import { friendlyError } from "../utils/errors";
import { API } from "../api";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [accepted, setAccepted] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill all fields.");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!accepted) {
      setError("Please accept the Terms of Use and Privacy Policy.");
      return;
    }

    try {
      const response = await fetch(
        `${API}/api/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
          }),
        }
      );

      const data = await response.text();

      if (response.ok) {
        setMessage("Registration successful! 🎉");

        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        });

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setError(friendlyError(data, "Registration failed."));
      }
    } catch (err) {
      setError(
        "Cannot connect to server. Please make sure Spring Boot is running."
      );
    }
  };

  return (
    <section className="auth-section">

      <div className="auth-card">

        <div className="auth-icon">
          🎵
        </div>

        <h1>Create Account</h1>

        <p className="auth-subtitle">
          Join Mara Academy and start learning music.
        </p>

        <form onSubmit={handleSubmit}>

          {/* Full Name */}

          <div className="form-group">

            <label>
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />

          </div>


          {/* Email */}

          <div className="form-group">

            <label>
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />

          </div>


          {/* Phone */}

          <div className="form-group">

            <label>
              Phone Number
            </label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter 10-digit phone number"
              maxLength="10"
            />

          </div>


          {/* Password */}

          <div className="form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
            />

          </div>


          {/* Confirm Password */}

          <div className="form-group">

            <label>
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
            />

          </div>


          <div className="terms-row">
            <label>
              <input
                type="checkbox"
                checked={accepted}
                onChange={(event) => setAccepted(event.target.checked)}
              />{" "}
              I accept the Terms of Use and Privacy Policy
            </label>
          </div>

          {/* Error */}

          {error && (
            <p className="error-message">
              {error}
            </p>
          )}


          {/* Success */}

          {message && (
            <p className="success-message">
              {message}
            </p>
          )}


          {/* Button */}

          <button
            type="submit"
            className="auth-btn"
          >
            Create Account
          </button>

        </form>


        <p className="auth-bottom">

          Already have an account?{" "}

          <Link to="/login">
            Login
          </Link>

        </p>

      </div>

    </section>
  );
}

export default Register;