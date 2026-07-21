import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
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

      <div className="nav-links">
        <Link to="/products">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/products">Sell</Link>
        <Link to="/wishlist">Wishlist</Link>
        <Link to="/my-products">My Products</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/inbox">Inbox</Link>
        <Link to="/profile">👤 Profile</Link>
      </div>

      <div className="nav-user">
        <span>Hello, {user?.name}</span>

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>

    </nav>
  );
}

export default Navbar;