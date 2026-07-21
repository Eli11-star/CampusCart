import { useEffect, useState } from "react";
import { useParams} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import API from "../api";
import Navbar from "../components/Navbar";
import "../App.css";
import toast from "react-hot-toast";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  useEffect(() => {
    API
      .get(`/products/${id}`)
      .then((res) => {
        
  
  setProduct(res.data);
})
  
.catch((err) => {
  toast.error(
    err.response?.data?.message ||
    "Couldn't load product."
  );
});
  }, [id]);


  if (!product) {
    return (
      <>
        <Navbar />
        <h2 style={{ textAlign: "center", marginTop: "50px" }}>
          Loading...
        </h2>
      </>
    );

  }
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("Logged in user:", user);
console.log("Product owner:", product.owner);


const startChat = async () => {
  const token = localStorage.getItem("token");

  try {
    const res = await API.post(
      `/chat/start/${product.owner._id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

   

    navigate(`/chat/${res.data._id}`);

  } catch (err) {
  toast.error(
    err.response?.data?.message ||
    "Couldn't start chat."
  );
}
};

const updateStatus = async (newStatus) => {
  

  try {
    const res = await API.put(
      `/products/${product._id}/status`,
      {
        status: newStatus,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setProduct(res.data);
    toast.success("Product status updated!");

  }catch (err) {
  toast.error(
    err.response?.data?.message ||
    "Couldn't update product status."
  );
}
};

  return (
    <>
      <Navbar />

      <div className="details-container">

        <button
          className="back-btn"
          onClick={() => navigate("/products")}
        >
          ← Back
        </button>

        <div className="details-card">

          <img
            src={product.image}
            alt={product.title}
            className="details-image"
          />

          <div className="details-info">

            <h1>{product.title}</h1>

            <h2>₹{Number(product.price).toLocaleString()}</h2>

            <span className="details-category">
  {product.category}
</span>

          <div className="seller-card">

<h3>Seller Information</h3>

<p>👤 {product.owner?.name}</p>

<p>✉ {product.owner?.email}</p>

</div> 

         <div className="description-box">

<h3>Description</h3>

<p>{product.description}</p>

</div>  

<p>
  <strong>Status:</strong>{" "}
  <span
className={
product.status==="Available"
?"status-available"
:"status-sold"
}
>

{product.status}

</span>
</p>

            

{product.owner?._id === user?.id ? (
  <div className="card-buttons">
    <button
      className="edit-btn"
      onClick={() => navigate("/products")}
    >
      ✏ Edit
    </button>

    <button
      className="delete-btn"
      onClick={async () => {
  if (!window.confirm("Delete this product?")) return;

  try {
    const token = localStorage.getItem("token");

    await API.delete(`/products/${product._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    toast.success("Product deleted successfully!");
    navigate("/profile");
  } catch (err) {
    toast.error(
      err.response?.data?.message ||
      "Couldn't delete product."
    );
  }
}}
    >
      🗑 Delete
    </button>
   <button
      className="contact-btn"
      onClick={() =>
        updateStatus(
          product.status === "Available"
            ? "Sold"
            : "Available"
        )
      }
    >
      {product.status === "Available"
        ? "✔ Mark as Sold"
        : "↩ Mark as Available"}
    </button>

  </div>
) : (
product.status === "Sold" ? (
  <button
    className="contact-btn"
    disabled
    style={{
      background: "#888",
      cursor: "not-allowed",
    }}
  >
    ❌ Item Sold
  </button>
) : (
  <button
    className="contact-btn"
    onClick={startChat}
  >
    💬 Chat with Seller
  </button>
))}
          </div>

        </div>

      </div>
    </>
  );

}

export default ProductDetails;