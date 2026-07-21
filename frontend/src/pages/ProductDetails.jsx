
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import Navbar from "../components/Navbar";
import "../App.css";
import toast from "react-hot-toast";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  // =========================
  // GET PRODUCT
  // =========================

  useEffect(() => {
    API.get(`/products/${id}`)
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


  // =========================
  // GET REVIEWS
  // =========================

  useEffect(() => {
    API.get(`/reviews/${id}`)
      .then((res) => {
        setReviews(res.data);
      })
      .catch((err) => {
        console.log("Review error:", err);

        toast.error(
          err.response?.data?.message ||
            "Couldn't load reviews."
        );
      });
  }, [id]);


  // =========================
  // LOADING
  // =========================

  if (!product) {
    return (
      <>
        <Navbar />

        <h2
          style={{
            textAlign: "center",
            marginTop: "50px",
          }}
        >
          Loading...
        </h2>
      </>
    );
  }


  const user = JSON.parse(
    localStorage.getItem("user")
  );


  // =========================
  // START CHAT
  // =========================

  const startChat = async () => {
    const token =
      localStorage.getItem("token");

    try {
      const res = await API.post(
        `/chat/start/${product.owner._id}`,
        {},
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      navigate(
        `/chat/${res.data._id}`
      );

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Couldn't start chat."
      );
    }
  };


  // =========================
  // UPDATE PRODUCT STATUS
  // =========================

  const updateStatus = async (
    newStatus
  ) => {
    const token =
      localStorage.getItem("token");

    try {
      const res = await API.put(
        `/products/${product._id}/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setProduct(res.data);

      toast.success(
        "Product status updated!"
      );

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Couldn't update product status."
      );
    }
  };


  // =========================
  // SUBMIT REVIEW
  // =========================

 const handleSubmitReview = async () => {
  if (!comment.trim()) {
    toast.error("Please write a review");
    return;
  }

  try {
    const res = await API.post(`/reviews/${id}`, {
      rating,
      comment,
    });

    setReviews((prev) => [...prev, res.data]);

    setComment("");
    setRating(5);

    toast.success("Review submitted!");
  } catch (error) {
    console.error(error);
    toast.error(
      error.response?.data?.message ||
        "Failed to submit review"
    );
  }
};

  // =========================
  // PAGE
  // =========================

  return (
    <>
      <Navbar />

      <div className="details-container">

        {/* BACK BUTTON */}

        <button
          className="back-btn"
          onClick={() =>
            navigate("/products")
          }
        >
          ← Back
        </button>


        {/* =========================
            PRODUCT DETAILS
        ========================= */}

        <div className="details-card">

          <img
            src={product.image}
            alt={product.title}
            className="details-image"
          />


          <div className="details-info">

            <h1>
              {product.title}
            </h1>

            <h2>
              ₹
              {Number(
                product.price
              ).toLocaleString()}
            </h2>


            <span className="details-category">
              {product.category}
            </span>


            {/* SELLER */}

            <div className="seller-card">

              <h3>
                Seller Information
              </h3>

              <p>
                👤{" "}
                {product.owner?.name}
              </p>

              <p>
                ✉{" "}
                {product.owner?.email}
              </p>

            </div>


            {/* DESCRIPTION */}

            <div className="description-box">

              <h3>
                Description
              </h3>

              <p>
                {product.description ||
                  "No description available."}
              </p>

            </div>


            {/* STATUS */}

            <p>
              <strong>
                Status:
              </strong>{" "}

              <span
                className={
                  product.status ===
                  "Available"
                    ? "status-available"
                    : "status-sold"
                }
              >
                {product.status}
              </span>

            </p>


            {/* OWNER BUTTONS */}

            {product.owner?._id ===
            user?.id ? (

              <div className="card-buttons">

                <button
                  className="edit-btn"
                  onClick={() =>
                    navigate(
                      "/products"
                    )
                  }
                >
                  ✏ Edit
                </button>


                <button
                  className="delete-btn"
                  onClick={async () => {

                    if (
                      !window.confirm(
                        "Delete this product?"
                      )
                    ) {
                      return;
                    }

                    try {

                      const token =
                        localStorage.getItem(
                          "token"
                        );

                      await API.delete(
                        `/products/${product._id}`,
                        {
                          headers: {
                            Authorization:
                              `Bearer ${token}`,
                          },
                        }
                      );

                      toast.success(
                        "Product deleted successfully!"
                      );

                      navigate(
                        "/profile"
                      );

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
                      product.status ===
                        "Available"
                        ? "Sold"
                        : "Available"
                    )
                  }
                >
                  {product.status ===
                  "Available"
                    ? "✔ Mark as Sold"
                    : "↩ Mark as Available"}
                </button>

              </div>

            ) : (

              /* BUYER BUTTON */

              product.status ===
              "Sold" ? (

                <button
                  className="contact-btn"
                  disabled
                  style={{
                    background:
                      "#888",
                    cursor:
                      "not-allowed",
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

              )

            )}

          </div>

        </div>


       {/* Reviews Section */}
<div className="reviews-section">
  <h2>⭐ Reviews & Ratings</h2>

  <h3>Leave a Review</h3>

  <div className="review-form">
    <select
      value={rating}
      onChange={(e) => setRating(Number(e.target.value))}
      className="rating-select"
    >
      <option value={5}>⭐⭐⭐⭐⭐</option>
      <option value={4}>⭐⭐⭐⭐</option>
      <option value={3}>⭐⭐⭐</option>
      <option value={2}>⭐⭐</option>
      <option value={1}>⭐</option>
    </select>

    <textarea
  value={comment}
  onChange={(e) => setComment(e.target.value)}
  placeholder="Write your review..."
  className="review-textarea"
/>
  </div>

  <button className="submit-review-btn" onClick={handleSubmitReview}>
    ⭐ Submit Review
  </button>

  <div className="reviews-list">
    {reviews.length === 0 ? (
      <p className="no-reviews">No reviews yet.</p>
    ) : (
      reviews.map((review) => (
        <div className="review-card" key={review._id}>
          <div className="review-header">
            <strong>{review.user?.name}</strong>
            <span>
              {"⭐".repeat(review.rating)}
            </span>
          </div>

          <p>{review.comment}</p>
        </div>
      ))
    )}
  </div>
</div>

      </div>
    </>
  );
}

export default ProductDetails;

