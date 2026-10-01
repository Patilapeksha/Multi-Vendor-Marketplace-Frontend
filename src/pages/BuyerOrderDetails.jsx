import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/BuyerOrderDetails.css";

const BuyerOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [vendorOrders, setVendorOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/orders/${id}`);

        setOrder(response.data.order);
        setItems(response.data.items || []);
        setVendorOrders(
          response.data.vendor_orders || []
        );
      } catch (err) {
        console.error("Order details error:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load order details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="order-details-status">
        Loading order details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-details-page">
        <main className="order-details-container">
          <div className="order-details-error">
            {error}
          </div>

          <button
            className="back-orders-button"
            onClick={() =>
              navigate("/buyer/orders")
            }
          >
            ← Back to My Orders
          </button>
        </main>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-details-status">
        Order not found.
      </div>
    );
  }

  const formatPrice = (value) =>
    Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

  const formatDate = (value) =>
    new Date(value).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    });

  return (
    <div className="order-details-page">

      <header className="order-details-header">
        <div>
          <h1>Multi-Vendor Marketplace</h1>
          <p>Order Details</p>
        </div>

        <button
          className="back-orders-header-button"
          onClick={() =>
            navigate("/buyer/orders")
          }
        >
          ← My Orders
        </button>
      </header>

      <main className="order-details-container">

        <div className="order-details-title-row">
          <div>
            <h2>Order #{order.id}</h2>

            <p>
              Placed on{" "}
              {formatDate(order.created_at)}
            </p>
          </div>

          <span
            className={`detail-status status-${order.status}`}
          >
            {order.status}
          </span>
        </div>

        {/* ORDER INFORMATION */}

        <section className="order-info-card">
          <h3>Order Information</h3>

          <div className="order-info-grid">

            <div>
              <span>Order ID</span>
              <strong>#{order.id}</strong>
            </div>

            <div>
              <span>Order Date</span>
              <strong>
                {formatDate(order.created_at)}
              </strong>
            </div>

            <div>
              <span>Total Amount</span>
              <strong>
                ₹{formatPrice(order.total_amount)}
              </strong>
            </div>

            <div>
              <span>Status</span>
              <strong className="capitalize">
                {order.status}
              </strong>
            </div>

          </div>

          <div className="shipping-section">
            <span>Shipping Address</span>

            <strong>
              {order.shipping_address}
            </strong>
          </div>
        </section>

        {/* ORDER ITEMS */}

        <section className="order-items-card">
          <h3>Order Items</h3>

          {items.length === 0 ? (
            <p className="no-items">
              No items found.
            </p>
          ) : (
            <div className="order-items-list">

              {items.map((item) => {

                const itemTotal =
                  Number(item.price) *
                  Number(item.quantity);

                return (
                  <div
                    className="order-item"
                    key={item.id}
                  >

                    <div className="order-item-icon">
                      📦
                    </div>

                    <div className="order-item-info">
                      <h4>
                        {item.product_title}
                      </h4>

                      <p>
                        Product ID:{" "}
                        {item.product_id}
                      </p>

                      <p>
                        Vendor ID:{" "}
                        {item.vendor_id}
                      </p>
                    </div>

                    <div className="order-item-quantity">
                      <span>Quantity</span>

                      <strong>
                        {item.quantity}
                      </strong>
                    </div>

                    <div className="order-item-price">
                      <span>Price</span>

                      <strong>
                        ₹{formatPrice(item.price)}
                      </strong>

                      <small>
                        Total: ₹
                        {formatPrice(itemTotal)}
                      </small>
                    </div>

                  </div>
                );
              })}

            </div>
          )}
        </section>

        {/* TRACKING */}

        <section className="tracking-card">
          <h3>Delivery & Tracking</h3>

          {vendorOrders.length === 0 ? (
            <p className="no-tracking">
              Tracking information is not
              available yet.
            </p>
          ) : (
            <div className="tracking-list">

              {vendorOrders.map(
                (vendorOrder) => (
                  <div
                    className="tracking-item"
                    key={
                      vendorOrder.vendor_order_id
                    }
                  >

                    <div className="tracking-header">

                      <div>
                        <h4>
                          Vendor Order #
                          {
                            vendorOrder.vendor_order_id
                          }
                        </h4>

                        <p>
                          Vendor ID:{" "}
                          {vendorOrder.vendor_id}
                        </p>
                      </div>

                      <span
                        className={`detail-status status-${vendorOrder.vendor_order_status}`}
                      >
                        {
                          vendorOrder.vendor_order_status
                        }
                      </span>

                    </div>

                    <div className="tracking-details">

                      <div>
                        <span>
                          Vendor Subtotal
                        </span>

                        <strong>
                          ₹
                          {formatPrice(
                            vendorOrder.vendor_subtotal
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Tracking Number
                        </span>

                        <strong>
                          {
                            vendorOrder.tracking_number ||
                            "Not available yet"
                          }
                        </strong>
                      </div>

                    </div>

                  </div>
                )
              )}

            </div>
          )}
        </section>

        {/* ACTIONS */}

        <div className="order-details-actions">

          <button
            onClick={() =>
              navigate("/buyer/orders")
            }
          >
            ← Back to My Orders
          </button>

          <button
            onClick={() =>
              navigate("/buyer/products")
            }
          >
            Continue Shopping
          </button>

        </div>

      </main>
    </div>
  );
};

export default BuyerOrderDetails;