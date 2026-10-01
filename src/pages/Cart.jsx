import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Cart.css";

const Cart = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ================= LOAD CART =================

  const loadCart = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/cart");

      setCartItems(response.data.cart || []);
    } catch (err) {
      console.error("Cart error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load cart"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // ================= UPDATE QUANTITY =================

  const updateQuantity = async (cartId, quantity) => {
    if (quantity < 1) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await api.put(`/cart/${cartId}`, {
        quantity
      });

      setMessage("Cart updated successfully");

      await loadCart();
    } catch (err) {
      console.error("Update cart error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update cart"
      );
    }
  };

  // ================= REMOVE ITEM =================

  const removeItem = async (cartId) => {
    try {
      setError("");
      setMessage("");

      await api.delete(`/cart/${cartId}`);

      setMessage("Product removed from cart");

      await loadCart();
    } catch (err) {
      console.error("Remove cart error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to remove product"
      );
    }
  };

  // ================= TOTAL =================

  const grandTotal = cartItems.reduce(
    (sum, item) =>
      sum + Number(item.total || 0),
    0
  );

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="cart-status">
        Loading cart...
      </div>
    );
  }

  return (
    <div className="cart-page">

      {/* HEADER */}

      <header className="cart-header">
        <div>
          <h1>Multi-Vendor Marketplace</h1>
          <p>My Shopping Cart</p>
        </div>

        <button
          className="continue-shopping-button"
          onClick={() =>
            navigate("/buyer/products")
          }
        >
          Continue Shopping
        </button>
      </header>

      {/* MAIN */}

      <main className="cart-container">

        <h2>Shopping Cart</h2>

        {/* SUCCESS */}

        {message && (
          <div className="cart-success">
            {message}
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="cart-error">
            {error}
          </div>
        )}

        {/* EMPTY CART */}

        {cartItems.length === 0 ? (
          <div className="empty-cart">

            <div className="empty-cart-icon">
              🛒
            </div>

            <h3>Your cart is empty</h3>

            <p>
              Add some products to your cart
              to continue.
            </p>

            <button
              onClick={() =>
                navigate("/buyer/products")
              }
            >
              Browse Products
            </button>

          </div>
        ) : (
          <div className="cart-layout">

            {/* CART ITEMS */}

            <div className="cart-items">

              {cartItems.map((item) => {

                const price =
                  Number(item.price);

                const quantity =
                  Number(item.quantity);

                const stock =
                  Number(
                    item.stock_quantity
                  );

                return (
                  <div
                    className="cart-item"
                    key={item.id}
                  >

                    {/* IMAGE */}

                    <div className="cart-item-image">

                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                        />
                      ) : (
                        <span>📦</span>
                      )}

                    </div>

                    {/* DETAILS */}

                    <div className="cart-item-details">

                      <h3>
                        {item.title}
                      </h3>

                      <p className="cart-price">
                        ₹
                        {price.toLocaleString(
                          "en-IN",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }
                        )}
                      </p>

                      <p className="cart-stock">
                        {stock} available
                      </p>

                      {/* QUANTITY */}

                      <div className="quantity-section">

                        <span>
                          Quantity:
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              quantity - 1
                            )
                          }
                          disabled={
                            quantity <= 1
                          }
                        >
                          −
                        </button>

                        <span className="quantity">
                          {quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              quantity + 1
                            )
                          }
                          disabled={
                            quantity >= stock
                          }
                        >
                          +
                        </button>

                      </div>

                      {/* REMOVE */}

                      <button
                        className="remove-button"
                        onClick={() =>
                          removeItem(item.id)
                        }
                      >
                        Remove
                      </button>

                    </div>

                    {/* ITEM TOTAL */}

                    <div className="cart-item-total">

                      <span>
                        Item Total
                      </span>

                      <strong>
                        ₹
                        {(
                          price * quantity
                        ).toLocaleString(
                          "en-IN",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }
                        )}
                      </strong>

                    </div>

                  </div>
                );
              })}

            </div>

            {/* SUMMARY */}

            <div className="cart-summary">

              <h3>Order Summary</h3>

              <div className="summary-row">
                <span>
                  Items
                </span>

                <span>
                  {cartItems.length}
                </span>
              </div>

              <div className="summary-row total-row">
                <strong>
                  Grand Total
                </strong>

                <strong>
                  ₹
                  {grandTotal.toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }
                  )}
                </strong>
              </div>

              <button
                className="checkout-button"
                onClick={() =>
                  navigate("/buyer/checkout")
                }
              >
                Proceed to Checkout
              </button>

            </div>

          </div>
        )}

      </main>

    </div>
  );
};

export default Cart;