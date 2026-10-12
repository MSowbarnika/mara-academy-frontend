import { API } from "../api";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API}/api/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );

      if (!response.ok) {
        const message = await response.text();
        setError(message || "Invalid login details.");
        return;
      }

      const admin = await response.json();

      // Store only non-password details
      localStorage.setItem(
        "admin",
        JSON.stringify({
          id: admin.id,
          email: admin.email,
          token: admin.token,
        })
      );

      navigate("/admin/dashboard");
    } catch (err) {
      setError(
        "Cannot connect to server. Check Spring Boot."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-section">
      <div className="auth-card">
        <div className="auth-icon">🔐</div>

        <h1>Admin Login</h1>

        <p className="auth-subtitle">
          Mara Academy Administration
        </p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          {error && (
            <p className="error-message">{error}</p>
          )}

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login as Admin"}
          </button>
        </form>

        <p className="auth-bottom">
          <Link to="/">← Back to Home</Link>
        </p>
      </div>
    </section>
  );
}

export default AdminLogin;