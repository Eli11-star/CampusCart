import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api";
import "../App.css";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
const [salesLoading, setSalesLoading] = useState(true);

 useEffect(() => {
  const token = localStorage.getItem("token");

  // Fetch all products
  API.get("/products")
    .then((res) => {
      setProducts(res.data);
    })
    .catch((err) => {
      console.log("Products error:", err);
    });

  // Fetch seller sales
  API.get("/purchase/sales", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      setSales(res.data);
    })
    .catch((err) => {
      console.log("Sales error:", err);
    })
    .finally(() => {
      setSalesLoading(false);
    });
}, []);

const myProducts = products.filter(
  (product) =>
    String(product.owner?._id) === String(user?.id)
);

const availableProducts = myProducts.filter(
  (product) => product.status === "Available"
);

const soldProducts = myProducts.filter(
  (product) => product.status === "Sold"
);

const totalSales = sales.reduce(
  (total, sale) =>
    total + (sale.product?.price || 0),
  0
);

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
    <h2>{myProducts.length}</h2>
    <p>My Products</p>
  </div>

  <div className="dashboard-card">
    <h2>{availableProducts.length}</h2>
    <p>Available</p>
  </div>

  <div className="dashboard-card">
    <h2>{soldProducts.length}</h2>
    <p>Products Sold</p>
  </div>

  <div className="dashboard-card">
    <h2>
      ₹{totalSales.toLocaleString()}
    </h2>
    <p>Total Sales</p>
  </div>

</div>

       <div className="sales-section">

  <h2>💰 Recent Sales</h2>

  {salesLoading ? (
    <p>Loading sales...</p>
  ) : sales.length === 0 ? (
    <p>No products sold yet.</p>
  ) : (
    <div className="sales-list">

      {sales.slice(0, 5).map((sale) => (

        <div className="sale-card" key={sale._id}>

          <img
            src={sale.product?.image}
            alt={sale.product?.title}
          />

          <div className="sale-info">

            <h3>
              {sale.product?.title}
            </h3>

            <p>
              Buyer: {sale.buyer?.name || "Unknown"}
            </p>

            <p>
              Email: {sale.buyer?.email || "N/A"}
            </p>

            <p>
              Purchased on:{" "}
              {new Date(
                sale.purchasedAt
              ).toLocaleDateString()}
            </p>

          </div>

          <div className="sale-price">
            ₹{Number(
              sale.product?.price || 0
            ).toLocaleString()}
          </div>

        </div>

      ))}

    </div>
  )}

</div>

      </div>
    </>
  );
}

export default Dashboard;