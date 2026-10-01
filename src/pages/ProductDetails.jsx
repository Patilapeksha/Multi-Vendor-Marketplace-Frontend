import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);

  const [error, setError] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/products/${id}`);

      setProduct(response.data.product);
    } catch (err) {
      console.error("Product details error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load product"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await api.get(
        `/reviews/product/${id}`
      );

      setReviews(response.data.reviews || []);
    } catch (err) {
      console.error("Reviews error:", err);
    }
  };

  const handleAddToCart = async () => {
    try {
      setReviewMessage("");
      setError("");

      const response = await api.post("/cart", {
        product_id: product.id,
        quantity: 1
      });

      setReviewMessage(
        response.data?.message ||
          "Product added to cart successfully"
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to add product to cart"
      );
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    try {
      setReviewLoading(true);
      setReviewMessage("");

      const response = await api.post("/reviews", {
        product_id: product.id,
        rating: Number(rating),
        comment: comment.trim() || null
      });

      setReviewMessage(
        response.data?.message ||
          "Review submitted successfully"
      );

      setComment("");
      setRating(5);

      await fetchReviews();
    } catch (err) {
      console.error("Submit review error:", err);

      setReviewMessage(
        err.response?.data?.message ||
          "Failed to submit review"
      );
    } finally {
      setReviewLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setReviewMessage("");

      const response = await api.delete(
        `/reviews/${reviewId}`
      );

      setReviewMessage(
        response.data?.message ||
          "Review deleted successfully"
      );

      await fetchReviews();
    } catch (err) {
      console.error("Delete review error:", err);

      setReviewMessage(
        err.response?.data?.message ||
          "Failed to delete review"
      );
    }
  };

  const formatPrice = (value) => {
    return Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const formatDate = (value) => {
    return new Date(value).toLocaleDateString(
      "en-IN",
      {
        dateStyle: "medium"
      }
    );
  };

  if (loading) {
    return (
      <div className="product-details-status">
        Loading product...
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="product-details-page">
        <div className="product-details-container">
          <div className="product-details-error">
            {error}
          </div>

          <button
            onClick={() =>
              navigate("/buyer/products")
            }
          >
            ← Back to Products
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-status">
        Product not found.
      </div>
    );
  }

  const stock = Number(
    product.stock_quantity || 0
  );

  return (
    <div className="product-details-page">

      {/* HEADER */}

      <header className="product-details-header">

        <div>
          <h1>
            Multi-Vendor Marketplace
          </h1>

          <p>
            Product Details
          </p>
        </div>

        <div className="product-header-actions">

          <button
            onClick={() =>
              navigate("/buyer/products")
            }
          >
            🛍 Products
          </button>

          <button
            onClick={() =>
              navigate("/buyer/cart")
            }
          >
            🛒 Cart
          </button>

          <button
            onClick={() =>
              navigate("/buyer/orders")
            }
          >
            📦 My Orders
          </button>

        </div>

      </header>

      <main className="product-details-container">

        {/* PRODUCT */}

        <section className="product-main-card">

          <div className="product-main-image">

            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.title}
              />
            ) : (
              <div className="product-main-placeholder">
                📦
              </div>
            )}

          </div>

          <div className="product-main-info">

            <span className="product-details-category">
              {product.category_name ||
                "Category"}
            </span>

            <h2>{product.title}</h2>

            <p className="product-details-description">
              {product.description ||
                "No description available"}
            </p>

            <div className="product-details-price">
              ₹{formatPrice(product.price)}
            </div>

            <div className="product-details-stock">
              {stock > 0
                ? `Stock available: ${stock}`
                : "Out of Stock"}
            </div>

            {reviewMessage && (
              <div className="review-message">
                {reviewMessage}
              </div>
            )}

            {error && product && (
              <div className="product-details-error">
                {error}
              </div>
            )}

            <button
              className="add-cart-button"
              onClick={handleAddToCart}
              disabled={stock <= 0}
            >
              🛒 Add to Cart
            </button>

          </div>

        </section>

        {/* REVIEWS */}

        <section className="reviews-section">

          <h2>⭐ Customer Reviews</h2>

          {/* REVIEW FORM */}

          <div className="review-form-card">

            <h3>Write a Review</h3>

            <form
              onSubmit={handleSubmitReview}
            >

              <label>
                Rating
              </label>

              <div className="star-rating">

                {[1, 2, 3, 4, 5].map(
                  (star) => (
                    <button
                      type="button"
                      key={star}
                      className={
                        star <= rating
                          ? "star active"
                          : "star"
                      }
                      onClick={() =>
                        setRating(star)
                      }
                    >
                      ★
                    </button>
                  )
                )}

              </div>

              <label>
                Comment
              </label>

              <textarea
                value={comment}
                onChange={(e) =>
                  setComment(e.target.value)
                }
                placeholder="Write your review..."
                rows="4"
              />

              <button
                type="submit"
                className="submit-review-button"
                disabled={reviewLoading}
              >
                {reviewLoading
                  ? "Submitting..."
                  : "Submit Review"}
              </button>

            </form>

          </div>

          {/* EXISTING REVIEWS */}

          <div className="reviews-list">

            <h3>
              {reviews.length} Review
              {reviews.length !== 1
                ? "s"
                : ""}
            </h3>

            {reviews.length === 0 ? (
              <div className="no-reviews">
                No reviews yet.
              </div>
            ) : (
              reviews.map((review) => (
                <div
                  className="review-card"
                  key={review.id}
                >

                  <div className="review-card-header">

                    <div>
                      <strong>
                        {review.buyer_name ||
                          "Buyer"}
                      </strong>

                      <div className="review-stars">
                        {"★".repeat(
                          Number(review.rating)
                        )}
                        {"☆".repeat(
                          5 -
                            Number(review.rating)
                        )}
                      </div>
                    </div>

                    <span>
                      {formatDate(
                        review.created_at
                      )}
                    </span>

                  </div>

                  <p>
                    {review.comment ||
                      "No comment provided."}
                  </p>

                  <button
                    className="delete-review-button"
                    onClick={() =>
                      handleDeleteReview(
                        review.id
                      )
                    }
                  >
                    Delete Review
                  </button>

                </div>
              ))
            )}

          </div>

        </section>

        {/* ACTIONS */}

        <div className="product-details-actions">

          <button
            onClick={() =>
              navigate("/buyer/products")
            }
          >
            ← Back to Products
          </button>

          <button
            onClick={() =>
              navigate("/buyer/orders")
            }
          >
            📦 My Orders
          </button>

        </div>

      </main>

    </div>
  );
};

export default ProductDetails;

