import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api";
import "../App.css";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get("/products")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Navbar />

      <div className="dashboard">

        <div className="dashboard-hero">
          <h1>Welcome back, {user?.name}! 👋</h1>

          <p>
            Buy • Sell • Connect with students on CampusCart
          </p>
        </div>

        <div className="dashboard-stats">

          <div className="dashboard-card">
            <h2>{products.length}</h2>
            <p>Products</p>
          </div>

          <div className="dashboard-card">
            <h2>
              ₹
              {products
                .reduce((sum, p) => sum + p.price, 0)
                .toLocaleString()}
            </h2>
            <p>Marketplace Value</p>
          </div>

          <div className="dashboard-card">
            <h2>{user?.name}</h2>
            <p>Logged In User</p>
          </div>

        </div>

        <div className="quick-actions">

          <button onClick={() => navigate("/products")}>
            🛍 Browse Products
          </button>

          <button onClick={() => navigate("/wishlist")}>
            ❤️ Wishlist
          </button>

          <button onClick={() => navigate("/cart")}>
            🛒 Cart
          </button>

          <button onClick={() => navigate("/inbox")}>
            💬 Inbox
          </button>

          <h2 style={{ marginTop: "50px", marginBottom: "20px" }}>
    Recently Added
</h2>

<div className="products">
  {products.slice(0, 4).map((product) => (
    <div
      className="card"
      key={product._id}
      onClick={() => navigate(`/products/${product._id}`)}
    >
      <div className="card-image">
        <img
          src={product.image}
          alt={product.title}
          className="product-image"
        />
      </div>

      <div className="card-body">
        <h2>{product.title}</h2>

        <h3>
          ₹{Number(product.price).toLocaleString()}
        </h3>
      </div>
    </div>
  ))}
</div>

        </div>

      </div>
    </>
  );
}

export default Dashboard;