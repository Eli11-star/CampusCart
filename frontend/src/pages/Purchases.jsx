
import { useEffect, useState } from "react";
import API from "../api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import "../App.css";

function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPurchases = () => {
    const token = localStorage.getItem("token");

    setLoading(true);

    API.get("/purchase", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setPurchases(res.data);
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.message ||
            "Couldn't load your purchases."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="container">
          <h2>Loading purchases...</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="container">
        <h1 className="page-title">
           My Purchases
        </h1>

        {purchases.length === 0 ? (
          <h2>You haven't purchased anything yet.</h2>
        ) : (
          <div className="products">
            {purchases.map((purchase) => (
              <div
                className="card"
                key={purchase._id}
              >
                {purchase.product ? (
                  <>
                    <div className="card-image">
                      <img
                        src={
                          purchase.product.image ||
                          "https://via.placeholder.com/300"
                        }
                        alt={purchase.product.title}
                        className="product-image"
                      />

                      <span className="category-tag">
                        {purchase.product.category}
                      </span>
                    </div>

                    <div className="card-body">
                      <h2>
                        {purchase.product.title}
                      </h2>

                      <h3 className="price">
                        ₹
                        {Number(
                          purchase.product.price || 0
                        ).toLocaleString()}
                      </h3>

                      <p>
                        Purchased on:{" "}
                        {new Date(
                          purchase.purchasedAt
                        ).toLocaleDateString()}
                      </p>

                      <p>
                        Status: ✅ Purchased
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="card-body">
                    <h2>
                      Product no longer available
                    </h2>

                    <p>
                      This product has been removed
                      from the marketplace.
                    </p>

                    <p>
                      Purchased on:{" "}
                      {new Date(
                        purchase.purchasedAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Purchases;

