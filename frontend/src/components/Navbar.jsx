import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">

      <div className="nav-logo">
        <img src="/logo.png" alt="CampusCart" />

        <div className="brand">
          <h2>CampusCart</h2>
          <span>Buy. Sell. Connect.</span>
        </div>
      </div>

      {/* Hamburger button */}
      <button
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      <div className={`nav-menu ${menuOpen ? "active" : ""}`}>

        <div className="nav-links">
          <Link to="/products" onClick={closeMenu}>Home</Link>
          <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>
          <Link to="/products" onClick={closeMenu}>Sell</Link>
          <Link to="/wishlist" onClick={closeMenu}>Wishlist</Link>
          <Link to="/my-products" onClick={closeMenu}>My Products</Link>
          <Link to="/cart" onClick={closeMenu}>Cart</Link>
          <Link to="/purchases" onClick={closeMenu}> My Purchases</Link>
          <Link to="/my-sales" onClick={closeMenu}> My Sales</Link>
          <Link to="/inbox" onClick={closeMenu}>Inbox</Link>
          <Link to="/profile" onClick={closeMenu}>👤 Profile</Link>
        </div>

        <div className="nav-user">
          <span>Hello, {user?.name}</span>

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>

      </div>

    </nav>
  );
}

export default Navbar;