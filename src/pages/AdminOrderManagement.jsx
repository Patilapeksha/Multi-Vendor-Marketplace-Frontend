import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/AdminOrderManagement.css";

const AdminOrderManagement = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/orders/admin/all");

      setOrders(response.data.orders || []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load orders"
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
      setSuccess("");

      await api.put(
        `/orders/${orderId}/status`,
        {
          status
        }
      );

      setSuccess(
        `Order #${orderId} status updated to ${status}.`
      );

      await loadOrders();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
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
    return `admin-order-status-${String(
      status || ""
    ).toLowerCase()}`;
  };

  return (
    <div className="admin-orders-page">

      <header className="admin-orders-header">

        <div>
          <h1>Multi-Vendor Marketplace</h1>
          <p>Admin Order Oversight</p>
        </div>

        <div className="admin-orders-actions">

          <button
            onClick={() =>
              navigate("/admin/dashboard")
            }
          >
            Dashboard
          </button>

          <button
            onClick={() =>
              navigate("/admin/vendors")
            }
          >
            Vendors
          </button>

          <button
            onClick={() =>
              navigate("/admin/products")
            }
          >
            Products
          </button>

        </div>

      </header>

      <main className="admin-orders-container">

        <section className="admin-orders-title">

          <h2>Order Oversight</h2>

          <p>
            Monitor customer orders and manage
            marketplace order status.
          </p>

        </section>

        {error && (
          <div className="admin-orders-error">
            {error}
          </div>
        )}

        {success && (
          <div className="admin-orders-success">
            {success}
          </div>
        )}

        {loading ? (
          <div className="admin-orders-message">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="admin-orders-empty">

            <div className="admin-order-empty-icon">
              🛒
            </div>

            <h3>No Orders Found</h3>

            <p>
              There are currently no customer orders.
            </p>

          </div>
        ) : (
          <div className="admin-orders-list">

            {orders.map((order) => (

              <div
                className="admin-order-card"
                key={order.id}
              >

                <div className="admin-order-main">

                  <div className="admin-order-icon">
                    🛒
                  </div>

                  <div>

                    <h3>
                      Order #{order.id}
                    </h3>

                    <span className="admin-order-date">
                      {order.created_at
                        ? new Date(
                            order.created_at
                          ).toLocaleString()
                        : "Date unavailable"}
                    </span>

                  </div>

                </div>

                <div className="admin-order-info">

                  <div>
                    <strong>Customer</strong>

                    <span>
                      {order.customer_name ||
                        "Unknown"}
                    </span>

                    <small>
                      {order.customer_email || ""}
                    </small>
                  </div>

                  <div>
                    <strong>Order Amount</strong>

                    <span>
                      ₹
                      {Number(
                        order.total_amount || 0
                      ).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
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

                <div className="admin-order-status-section">

                  <div>

                    <strong>
                      Current Status
                    </strong>

                    <span
                      className={`admin-order-status ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {order.status || "pending"}
                    </span>

                  </div>

                  <div className="admin-order-control">

                    <label>
                      Change Status
                    </label>

                    <select
                      value={
                        order.status || "pending"
                      }
                      disabled={
                        updatingId === order.id
                      }
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
                      <span className="admin-order-updating">
                        Updating...
                      </span>
                    )}

                  </div>

                </div>

              </div>

            ))}

          </div>
        )}

      </main>

    </div>
  );
};

export default AdminOrderManagement;