import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../App.css";
import { useNavigate } from "react-router-dom";


function MyProducts() {
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();

const [showModal, setShowModal] = useState(false);
const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5000/my-products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setProducts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

    return (
  <>
    <Navbar />

    <div className="container">

      <div className="hero">
        <h1>📦 My Products</h1>

        
        <p>Manage your marketplace listings.</p>
{showModal && (
  <div className="modal-overlay">
    <div className="modal">
      <h2>Delete Product?</h2>

      <p>Are you sure you want to delete this product?</p>

      <div className="modal-buttons">
        <button
          className="cancel-btn"
          onClick={() => {
            setShowModal(false);
            setDeleteId(null);
          }}
        >
          Cancel
        </button>

        <button
          className="confirm-btn"
          onClick={confirmDelete}
        >
          Yes
        </button>
      </div>
    </div>
  </div>
)}

      </div>

      <div className="stats">
        <div className="stat-card">
          <h2>{products.length}</h2>
          <p>Total Listings</p>
        </div>

        <div className="stat-card">
          <h2>
            ₹
            {products
              .reduce((sum, p) => sum + p.price, 0)
              .toLocaleString()}
          </h2>
          <p>Total Value</p>
        </div>
      </div>

      <div className="products">
        {products.length === 0 ? (
          <h2>No Products Added Yet</h2>
        ) : (
          products.map((product) => (
            <div className="card" key={product._id}>
              <div className="card-image">
                <img
                  src={product.image}
                  alt={product.title}
                  className="product-image"
                />

                <span className="category-tag">
                  {product.category}
                </span>
              </div>

              <div className="card-body">
                <h2>{product.title}</h2>

                <h3 className="price">
                  ₹{product.price.toLocaleString()}
                </h3>

                <p className="description">
                  {product.description}
                </p>

                <div className="card-buttons">
                 <button
  className="edit-btn"
  onClick={() => navigate("/products")}
>
  ✏ Edit
</button>

                 <button
  className="delete-btn"
  onClick={() => handleDelete(product._id)}
>
  🗑 Delete
</button> 
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  </>
);
}

export default MyProducts;