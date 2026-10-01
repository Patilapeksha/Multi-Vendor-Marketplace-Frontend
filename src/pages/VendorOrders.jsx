import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/VendorOrders.css";

const VendorOrders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/orders/vendor");

      setOrders(response.data.orders || []);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to load vendor orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      setUpdatingId(orderId);
      setError("");

      await api.put(`/orders/vendor/${orderId}/status`, {
        status
      });

      await loadOrders();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to update order status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusClass = (status) => {
    return `status-${String(status || "")
      .toLowerCase()
      .replace(/\s+/g, "-")}`;
  };

  return (
    <div className="vendor-orders-page">
      <header className="vendor-orders-header">
        <div>
          <h1>Multi-Vendor Marketplace</h1>
          <p>Vendor Orders</p>
        </div>

        <div className="vendor-orders-actions">
          <button onClick={() => navigate("/vendor/dashboard")}>
            Dashboard
          </button>

          <button onClick={() => navigate("/vendor/products")}>
            Products
          </button>
        </div>
      </header>

      <main className="vendor-orders-container">
        <div className="vendor-orders-title">
          <h2>Customer Orders</h2>
          <p>View and fulfill orders containing your products.</p>
        </div>

        {error && (
          <div className="vendor-orders-error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="vendor-orders-message">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="vendor-orders-empty">
            <div className="empty-icon">🛒</div>
            <h3>No Orders Found</h3>
            <p>
              You don't have any customer orders yet.
            </p>
          </div>
        ) : (
          <div className="vendor-orders-list">
            {orders.map((order) => (
              <div
                className="vendor-order-card"
                key={order.id}
              >
                <div className="vendor-order-top">
                  <div>
                    <h3>Order #{order.id}</h3>

                    <p>
                      Date:{" "}
                      {order.created_at
                        ? new Date(
                            order.created_at
                          ).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>

                  <span
                    className={`vendor-order-status ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {order.status || "Pending"}
                  </span>
                </div>

                <div className="vendor-order-details">
                  <div>
                    <strong>Customer</strong>
                    <span>
                      {order.customer_name ||
                        order.buyer_name ||
                        order.user_name ||
                        "Customer"}
                    </span>
                  </div>

                  <div>
                    <strong>Total</strong>
                    <span>
                      ₹
                      {Number(
                        order.total_amount || order.total || 0
                      ).toFixed(2)}
                    </span>
                  </div>

                  <div>
                    <strong>Shipping Address</strong>
                    <span>
                      {order.shipping_address ||
                        "Not available"}
                    </span>
                  </div>
                </div>

                <div className="vendor-order-update">
                  <label>Update Order Status</label>

                  <select
                    value={order.status || "pending"}
                    disabled={updatingId === order.id}
                    onChange={(e) =>
                      updateStatus(
                        order.id,
                        e.target.value
                      )
                    }
                  >
                    <option value="pending">
                      Pending
                    </option>

                    <option value="confirmed">
                      Confirmed
                    </option>

                    <option value="processing">
                      Processing
                    </option>

                    <option value="shipped">
                      Shipped
                    </option>

                    <option value="delivered">
                      Delivered
                    </option>

                    <option value="cancelled">
                      Cancelled
                    </option>
                  </select>

                  {updatingId === order.id && (
                    <span className="updating-text">
                      Updating...
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default VendorOrders;