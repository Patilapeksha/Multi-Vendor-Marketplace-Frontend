import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/BuyerOrders.css";

const BuyerOrders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      // Correct backend route
      const response = await api.get("/orders/my");

      setOrders(response.data.orders || []);
    } catch (err) {
      console.error("Orders error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (value) => {
    return Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const formatDate = (value) => {
    return new Date(value).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    });
  };

  return (
    <div className="buyer-orders-page">

      {/* HEADER */}

      <header className="buyer-orders-header">

        <div>
          <h1>Multi-Vendor Marketplace</h1>

          <p>
            My Orders
          </p>
        </div>

        <div className="orders-header-actions">

          <button
            className="cart-button"
            onClick={() =>
              navigate("/buyer/cart")
            }
          >
            🛒 Cart
          </button>

          <button
            className="products-button"
            onClick={() =>
              navigate("/buyer/products")
            }
          >
            🛍 Products
          </button>

        </div>

      </header>

      {/* MAIN */}

      <main className="buyer-orders-container">

        <div className="orders-title">

          <h2>My Orders</h2>

          <p>
            View all your placed orders and their
            current status.
          </p>

        </div>

        {/* ERROR */}

        {error && (
          <div className="orders-error">
            {error}
          </div>
        )}

        {/* LOADING */}

        {loading ? (
          <div className="orders-status">
            Loading your orders...
          </div>
        ) : orders.length === 0 ? (

          <div className="orders-empty">

            <div className="empty-icon">
              📦
            </div>

            <h3>
              No Orders Found
            </h3>

            <p>
              You haven't placed any orders yet.
            </p>

            <button
              onClick={() =>
                navigate("/buyer/products")
              }
            >
              Start Shopping
            </button>

          </div>

        ) : (

          /* ORDERS LIST */

          <div className="orders-list">

            {orders.map((order) => (

              <div
                className="order-card"
                key={order.id}
              >

                <div className="order-card-header">

                  <div>
                    <span>
                      Order ID
                    </span>

                    <h3>
                      #{order.id}
                    </h3>
                  </div>

                  <span
                    className={`order-status status-${order.status}`}
                  >
                    {order.status}
                  </span>

                </div>

                <div className="order-card-details">

                  <div>
                    <span>
                      Order Date
                    </span>

                    <strong>
                      {formatDate(
                        order.created_at
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Total Amount
                    </span>

                    <strong>
                      ₹
                      {formatPrice(
                        order.total_amount
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Shipping Address
                    </span>

                    <strong>
                      {order.shipping_address}
                    </strong>
                  </div>

                </div>

                <div className="order-card-footer">

                  <button
                    className="view-order-button"
                    onClick={() =>
                      navigate(
                        `/buyer/orders/${order.id}`
                      )
                    }
                  >
                    View Order Details
                  </button>

                </div>

              </div>

            ))}

          </div>
        )}

      </main>

    </div>
  );
};

export default BuyerOrders;
