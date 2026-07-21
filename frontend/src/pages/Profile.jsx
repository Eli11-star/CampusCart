import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api";
import "../App.css";
import toast from "react-hot-toast";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    API.get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => {
  toast.error(
    err.response?.data?.message ||
    "Couldn't load products."
  );
});

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
      "Couldn't load wishlist."
    );
  });
      

    API.get("/cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => setCart(res.data))
      .catch((err) => {
  toast.error(
    err.response?.data?.message ||
    "Couldn't load cart."
  );
});
     
      API.get("/purchase", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((res) => setPurchases(res.data))
  .catch((err) => {
  toast.error(
    err.response?.data?.message ||
    "Couldn't load purchase history."
  );
});
  
  }, []);

  const myProducts = products.filter(
    (p) => p.owner?._id === user?.id
  );

  const soldProducts = myProducts.filter(
    (p) => p.status === "Sold"
  );

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await API.delete(`/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        
      });

      setProducts(products.filter((product) => product._id !== id));
    } catch (err) {
  toast.error(
    err.response?.data?.message ||
    "Couldn't delete product."
  );
}
  };

  return (
    <>
      <Navbar />

      <div className="profile-container">

        {/* Profile Card */}
        <div className="profile-card">

          <h3>Welcome to CampusCart!</h3>

          <p>
            Manage your listings, wishlist, and purchases all in one place.
          </p>

          <div className="profile-avatar">
            {user?.name?.(0).toUpperCase()}
          </div>

          <h1>{user?.name}</h1>

          <p>{user?.email}</p>

        </div>

        {/* Stats */}
        <div className="profile-stats">

          <div className="profile-stat">
            <h2>{myProducts.length}</h2>
            <p>Products Listed</p>
          </div>

          <div className="profile-stat">
            <h2>{soldProducts.length}</h2>
            <p>Products Sold</p>
          </div>

          <div className="profile-stat">
            <h2>{wishlist.length}</h2>
            <p>Wishlist</p>
          </div>

          <div className="profile-stat">
            <h2>{cart.length}</h2>
            <p>Cart Items</p>
          </div>

        </div>

        {/* My Listings */}
        <div className="my-products-section">

          <h2>My Listings</h2>

          {myProducts.length === 0 ? (
            <p>No products listed yet.</p>
          ) : (
            <div className="my-products-grid">

              {myProducts.map((product) => (

                <div className="my-product-card" key={product._id}>

                  <img
                    src={product.image}
                    alt={product.title}
                  />

                  <h3>{product.title}</h3>

                  <p>₹{Number(product.price).toLocaleString()}</p>

                  <p>{product.category}</p>

                  <span>{product.status}</span>

                  <div className="product-actions">

                    <button
                      onClick={() =>
                        navigate(`/edit-product/${product._id}`)
                      }
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(product._id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>

        {/* Wishlist */}
        <div className="my-products-section">

          <h2>My Wishlist</h2>

          {wishlist.length === 0 ? (
            <p>Your wishlist is empty.</p>
          ) : (
            <div className="my-products-grid">

              {wishlist.map((item) => (

                <div
                  className="my-product-card"
                  key={item._id}
                >

                  <img
                    src={item.image}
                    alt={item.title}
                  />

                  <h3>{item.title}</h3>

                  <p>₹{Number(item.price).toLocaleString()}</p>

                  <p>{item.category}</p>

                </div>
                

              ))}

            </div>
          )}

        </div>
        <div className="my-products-section">
  <h2>Purchase History</h2>

  {purchases.length === 0 ? (
    <p>No purchases yet.</p>
  ) : (
    <div className="my-products-grid">
      {purchases.map((purchase) => (
        <div
          className="my-product-card"
          key={purchase._id}
        >
          <img
            src={purchase.product.image}
            alt={purchase.product.title}
          />

          <h3>{purchase.product.title}</h3>

          <p>₹{Number(purchase.product.price).toLocaleString()}</p>

          <p>
            Purchased on{" "}
            {new Date(
              purchase.purchasedAt
            ).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  )}
</div>

      </div>

    </>
  );
}

export default Profile;