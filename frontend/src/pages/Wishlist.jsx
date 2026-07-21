import { useEffect, useState } from "react";
import API from "../api";
import Navbar from "../components/Navbar";
import "../App.css";
import toast from "react-hot-toast";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = () => {
  const token = localStorage.getItem("token");

  setLoading(true);

  API.get("/wishlist", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      setWishlist(res.data);
    })
    .catch((err) => {
      toast.error(
        err.response?.data?.message ||
        "Couldn't load your wishlist."
      );
    })
    .finally(() => {
      setLoading(false);
    });
};

  useEffect(() => {
    fetchWishlist();
  }, []);
if (loading) {
  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Loading wishlist...</h2>
      </div>
    </>
  );
}

  return (
    <>
      <Navbar />

      <div className="container">
        <h1 className="page-title">❤️ My Wishlist</h1>

        <div className="products">
          {wishlist.length === 0 ? (
            <h2>No products in wishlist.</h2>
          ) : (
            wishlist.map((item) => (
              <div className="card" key={item._id}>
                <div className="card-image">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="product-image"
                  />

                  <span className="category-tag">
                    {item.category}
                  </span>
                </div>

                <div className="card-body">
                  <h2>{item.title}</h2>

                  <h3 className="price">
                    ₹{Number(item.price).toLocaleString()}
                  </h3>
<button
  className="contact-btn"
  onClick={() => {
    if (item.owner?.email) {
      window.location.href = `mailto:${item.owner.email}`;
    } else {
      toast.error("Seller email not available.");
    }
  }}
>
  📩 Contact Seller
</button>
                  
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Wishlist;