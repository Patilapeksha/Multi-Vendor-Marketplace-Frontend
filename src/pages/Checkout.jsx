import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [shippingAddress, setShippingAddress] =
    useState("");

  const [paymentMethod, setPaymentMethod] =
    useState("mock");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [orderId, setOrderId] = useState(null);
  const [paymentReference, setPaymentReference] =
    useState("");

  const loadCart = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/cart");

      setCartItems(response.data.cart || []);
    } catch (err) {
      console.error("Checkout cart error:", err);

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

  const grandTotal = cartItems.reduce(
    (sum, item) =>
      sum + Number(item.total || 0),
    0
  );

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!shippingAddress.trim()) {
      setError(
        "Please enter your shipping address"
      );
      return;
    }

    if (shippingAddress.trim().length < 10) {
      setError(
        "Please enter a complete shipping address"
      );
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty");
      return;
    }

    try {
      setProcessing(true);

      // ==========================================
      // 1. CREATE ORDER
      // ==========================================

      const checkoutResponse = await api.post(
        "/orders",
        {
          shipping_address:
            shippingAddress.trim()
        }
      );

      const createdOrderId =
        checkoutResponse.data?.order_id;

      if (!createdOrderId) {
        throw new Error(
          "Order ID was not returned"
        );
      }

      setOrderId(createdOrderId);

      // ==========================================
      // 2. CREATE MOCK PAYMENT
      // ==========================================

      const paymentResponse = await api.post(
        "/payments",
        {
          order_id: createdOrderId,
          payment_method: paymentMethod
        }
      );

      const createdPaymentReference =
        paymentResponse.data
          ?.payment_reference;

      if (!createdPaymentReference) {
        throw new Error(
          "Payment reference was not returned"
        );
      }

      setPaymentReference(
        createdPaymentReference
      );

      // ==========================================
      // 3. SIMULATE PAYMENT WEBHOOK
      // ==========================================

      const webhookResponse =
        await api.post(
          "/payments/webhook",
          {
            payment_reference:
              createdPaymentReference,
            payment_status: "success"
          }
        );

      if (webhookResponse.status !== 200) {
        throw new Error(
          "Payment webhook failed"
        );
      }

      // ==========================================
      // 4. CHECK PAYMENT STATUS
      // ==========================================

      const paymentStatusResponse =
        await api.get(
          `/payments/order/${createdOrderId}`
        );

      const paymentStatus =
        paymentStatusResponse.data
          ?.payment?.status;

      if (paymentStatus !== "success") {
        throw new Error(
          "Payment was not successful"
        );
      }

      // ==========================================
      // SUCCESS
      // ==========================================

      setSuccess(
        `Payment successful! Order #${createdOrderId} has been placed.`
      );

      // Cart should now be empty because
      // checkout consumed the cart.
      setCartItems([]);

    } catch (err) {
      console.error(
        "Checkout/payment error:",
        err
      );

      setError(
        err.response?.data?.message ||
          err.message ||
          "Payment failed"
      );
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="checkout-status">
        Loading checkout...
      </div>
    );
  }

  // ==========================================
  // PAYMENT SUCCESS SCREEN
  // ==========================================

  if (success) {
    return (
      <div className="checkout-page">

        <header className="checkout-header">

          <div>
            <h1>
              Multi-Vendor Marketplace
            </h1>

            <p>Payment Successful</p>
          </div>

        </header>

        <main className="checkout-container">

          <div className="payment-success-card">

            <div className="payment-success-icon">
              ✓
            </div>

            <h2>
              Order Placed Successfully!
            </h2>

            <p>
              {success}
            </p>

            {orderId && (
              <p>
                <strong>
                  Order ID:
                </strong>{" "}
                #{orderId}
              </p>
            )}

            {paymentReference && (
              <p>
                <strong>
                  Payment Reference:
                </strong>{" "}
                {paymentReference}
              </p>
            )}

            <div className="success-actions">

              <button
                onClick={() =>
                  navigate(
                    "/buyer/products"
                  )
                }
              >
                Continue Shopping
              </button>

              <button
                onClick={() =>
                  navigate(
                    "/buyer/orders"
                  )
                }
              >
                View My Orders
              </button>

            </div>

          </div>

        </main>

      </div>
    );
  }

  return (
    <div className="checkout-page">

      {/* ================= HEADER ================= */}

      <header className="checkout-header">

        <div>
          <h1>
            Multi-Vendor Marketplace
          </h1>

          <p>Checkout</p>
        </div>

        <button
          className="back-cart-button"
          onClick={() =>
            navigate("/buyer/cart")
          }
          disabled={processing}
        >
          ← Back to Cart
        </button>

      </header>

      {/* ================= MAIN ================= */}

      <main className="checkout-container">

        <h2>Checkout</h2>

        {error && (
          <div className="checkout-error">
            {error}
          </div>
        )}

        <form
          className="checkout-layout"
          onSubmit={handlePlaceOrder}
        >

          {/* ================= ORDER ITEMS ================= */}

          <section className="checkout-items">

            <h3>Order Items</h3>

            {cartItems.map((item) => (

              <div
                className="checkout-item"
                key={item.id}
              >

                <div className="checkout-item-image">

                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                    />
                  ) : (
                    <span>📦</span>
                  )}

                </div>

                <div className="checkout-item-info">

                  <h4>
                    {item.title}
                  </h4>

                  <p>
                    Quantity:{" "}
                    {item.quantity}
                  </p>

                  <p>
                    ₹
                    {Number(
                      item.price
                    ).toLocaleString(
                      "en-IN",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      }
                    )}
                  </p>

                </div>

                <strong>
                  ₹
                  {Number(
                    item.total || 0
                  ).toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }
                  )}
                </strong>

              </div>

            ))}

          </section>

          {/* ================= PAYMENT ================= */}

          <section className="checkout-payment">

            <h3>
              Shipping Address
            </h3>

            <textarea
              className="shipping-address"
              placeholder="Enter your complete shipping address"
              value={shippingAddress}
              onChange={(e) =>
                setShippingAddress(
                  e.target.value
                )
              }
              rows="4"
              disabled={processing}
            />

            <h3>Payment</h3>

            <div className="payment-option">

              <label>

                <input
                  type="radio"
                  name="payment"
                  value="mock"
                  checked={
                    paymentMethod ===
                    "mock"
                  }
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value
                    )
                  }
                  disabled={processing}
                />

                <span>
                  Mock Payment
                </span>

              </label>

              <p>
                Test payment option for
                this marketplace.
              </p>

            </div>

            {/* ================= SUMMARY ================= */}

            <div className="checkout-summary">

              <div>
                <span>
                  Items
                </span>

                <span>
                  {cartItems.length}
                </span>
              </div>

              <div className="checkout-total">

                <strong>
                  Total
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

            </div>

            <button
              type="submit"
              className="place-order-button"
              disabled={processing}
            >
              {processing
                ? "Processing Payment..."
                : "Pay & Place Order"}
            </button>

          </section>

        </form>

      </main>

    </div>
  );
};

export default Checkout;