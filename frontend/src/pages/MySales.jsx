
import { useEffect, useState } from "react";
import API from "../api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import "../App.css";

function MySales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSales = () => {
    const token = localStorage.getItem("token");

    setLoading(true);

    API.get("/purchase/sales", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setSales(res.data);
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.message ||
            "Couldn't load your sales."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSales();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="container">
          <h2>Loading sales...</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="container">

        <div className="hero">
          <h1> My Sales</h1>
          <p>Track the products you have sold.</p>
        </div>

        <div className="stats">

          <div className="stat-card">
            <h2>{sales.length}</h2>
            <p>Total Sales</p>
          </div>

          <div className="stat-card">
            <h2>
              ₹
              {sales
                .reduce(
                  (sum, sale) =>
                    sum + (sale.product?.price || 0),
                  0
                )
                .toLocaleString()}
            </h2>
            <p>Total Earnings</p>
          </div>

        </div>

        <div className="products">

          {sales.length === 0 ? (
            <h2>You haven't sold any products yet.</h2>
          ) : (
            sales.map((sale) => (

              <div
                className="card"
                key={sale._id}
              >

                {sale.product ? (
                  <>
                    <div className="card-image">

                      <img
                        src={
                          sale.product.image ||
                          "https://via.placeholder.com/300"
                        }
                        alt={sale.product.title}
                        className="product-image"
                      />

                      <span className="category-tag">
                        {sale.product.category}
                      </span>

                    </div>

                    <div className="card-body">

                      <h2>
                        {sale.product.title}
                      </h2>

                      <h3 className="price">
                        ₹
                        {Number(
                          sale.product.price || 0
                        ).toLocaleString()}
                      </h3>

                      <p>
                        👤 Buyer:{" "}
                        {sale.buyer?.name ||
                          "Unknown"}
                      </p>

                      <p>
                        📧 Email:{" "}
                        {sale.buyer?.email ||
                          "Not available"}
                      </p>

                      <p>
                        📅 Sold on:{" "}
                        {new Date(
                          sale.purchasedAt
                        ).toLocaleDateString()}
                      </p>

                      <p>
                        Status: ✅ Sold
                      </p>

                    </div>
                  </>
                ) : (
                  <div className="card-body">
                    <h2>
                      Product no longer available
                    </h2>

                    <p>
                      This product was sold but is
                      no longer available.
                    </p>

                    <p>
                      Buyer:{" "}
                      {sale.buyer?.name ||
                        "Unknown"}
                    </p>
                  </div>
                )}

              </div>

            ))
          )}

        </div>

      </div>
    </>
  );
}

export default MySales;

