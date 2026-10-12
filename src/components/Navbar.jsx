import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BRAND_NAME } from "../config";
import ContactModal from "./ContactModal";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showContact, setShowContact] = useState(false);

  // The home page and the course pages have their own banner, so no top bar there
  const ownHeader =
    location.pathname === "/" ||
    location.pathname === "/demo" ||
    location.pathname === "/dashboard" ||
    location.pathname.startsWith("/course/");

  if (ownHeader) {
    return null;
  }

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch (error) {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="logo">
          🎵 {BRAND_NAME}
        </Link>

        <div className="nav-buttons">
          {user ? (
            <>
              <Link to="/dashboard" className="login-btn">
                My Dashboard
              </Link>
              <button type="button" className="demo-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="login-btn">
              Student Login
            </Link>
          )}

          <button
            type="button"
            className="demo-btn"
            onClick={() => setShowContact(true)}
          >
            Contact Info
          </button>
        </div>
      </nav>

      <ContactModal open={showContact} onClose={() => setShowContact(false)} />
    </>
  );
}

export default Navbar;
