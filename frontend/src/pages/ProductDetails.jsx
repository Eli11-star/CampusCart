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
  const [reviews, setReviews] = useState([]);
const [rating, setRating] = useState(5);
const [comment, setComment] = useState("");
const [reviewLoading, setReviewLoading] = useState(false);

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

  useEffect(() => {
  API
    .get(`/reviews/${id}`)
    .then((res) => {
      setReviews(res.data);
    })
    .catch((err) => {
      toast.error(
        err.response?.data?.message ||
        "Couldn't load reviews."
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
  const token = localStorage.getItem("token");

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

const submitReview = async () => {
  const token = localStorage.getItem("token");

  if (!comment.trim()) {
    toast.error("Please write a review.");
    return;
  }

  setReviewLoading(true);

  try {
    const res = await API.post(
      `/reviews/${id}`,
      {
        rating: Number(rating),
        comment: comment.trim(),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setReviews((prev) => [
      res.data,
      ...prev,
    ]);

    setRating(5);
    setComment("");

    toast.success("Review added successfully! ⭐");

  } catch (err) {
    toast.error(
      err.response?.data?.message ||
      "Couldn't add review."
    );
  } finally {
    setReviewLoading(false);
  }
};
  return (
    <>
      <Navbar />

     <div className="details-container">

  <button className="back-btn">
    ← Back
  </button>

  <div className="details-card">
    {/* Your existing product details */}
  </div>

  {/* ⭐ Reviews Section */}
  <div className="reviews-section">

    <h2>⭐ Reviews & Ratings</h2>

    {/* Average Rating */}
    {reviews.length > 0 && (
      <div className="average-rating">
        <h3>
          ⭐{" "}
          {(
            reviews.reduce(
              (sum, review) =>
                sum + review.rating,
              0
            ) / reviews.length
          ).toFixed(1)}
          / 5
        </h3>

        <p>
          Based on {reviews.length} review
          {reviews.length !== 1 ? "s" : ""}
        </p>
      </div>
    )}

    {/* Add Review */}
    <div className="review-form">

      <h3>Leave a Review</h3>

      <select
        value={rating}
        onChange={(e) =>
          setRating(e.target.value)
        }
      >
        <option value="5">⭐⭐⭐⭐⭐ 5</option>
        <option value="4">⭐⭐⭐⭐ 4</option>
        <option value="3">⭐⭐⭐ 3</option>
        <option value="2">⭐⭐ 2</option>
        <option value="1">⭐ 1</option>
      </select>

      <textarea
        placeholder="Write your review..."
        value={comment}
        onChange={(e) =>
          setComment(e.target.value)
        }
        rows="4"
      />

      <button
        className="contact-btn"
        onClick={submitReview}
        disabled={reviewLoading}
      >
        {reviewLoading
          ? "Submitting..."
          : "⭐ Submit Review"}
      </button>

    </div>

    {/* Reviews List */}
    <div className="reviews-list">

      {reviews.length === 0 ? (
        <h3>No reviews yet.</h3>
      ) : (
        reviews.map((review) => (
          <div
            className="review-card"
            key={review._id}
          >

            <h3>
              {review.reviewer?.name ||
                "Anonymous"}
            </h3>

            <p>
              {"⭐".repeat(review.rating)}
            </p>

            <p>
              {review.comment}
            </p>

            <small>
              {new Date(
                review.createdAt
              ).toLocaleDateString()}
            </small>

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