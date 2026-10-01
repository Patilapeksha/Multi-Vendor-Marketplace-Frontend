import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/VendorPayouts.css";

const VendorPayouts = () => {
  const navigate = useNavigate();

  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPayouts();
  }, []);

  const loadPayouts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/vendor/payouts");

      setPayouts(response.data.payouts || []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load payouts"
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    return `payout-status-${String(status || "")
      .toLowerCase()
      .replace(/\s+/g, "-")}`;
  };

  return (
    <div className="vendor-payouts-page">
      <header className="vendor-payouts-header">
        <div>
          <h1>Multi-Vendor Marketplace</h1>
          <p>Vendor Payouts</p>
        </div>

        <div className="vendor-payouts-actions">
          <button
            onClick={() =>
              navigate("/vendor/dashboard")
            }
          >
            Dashboard
          </button>

          <button
            onClick={() =>
              navigate("/vendor/products")
            }
          >
            Products
          </button>

          <button
            onClick={() =>
              navigate("/vendor/orders")
            }
          >
            Orders
          </button>
        </div>
      </header>

      <main className="vendor-payouts-container">
        <section className="vendor-payouts-title">
          <h2>Payouts</h2>
          <p>
            View your earnings, commissions and payout
            status.
          </p>
        </section>

        {error && (
          <div className="vendor-payouts-error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="vendor-payouts-message">
            Loading payouts...
          </div>
        ) : payouts.length === 0 ? (
          <div className="vendor-payouts-empty">
            <div className="payout-empty-icon">💰</div>

            <h3>No Payouts Found</h3>

            <p>
              You don't have any payouts yet.
            </p>
          </div>
        ) : (
          <div className="vendor-payouts-list">
            {payouts.map((payout) => (
              <div
                className="vendor-payout-card"
                key={payout.id}
              >
                <div className="vendor-payout-top">
                  <div>
                    <h3>
                      Payout #{payout.id}
                    </h3>

                    <p>
                      Order #{payout.order_id}
                    </p>
                  </div>

                  <span
                    className={`payout-status ${getStatusClass(
                      payout.status
                    )}`}
                  >
                    {payout.status || "pending"}
                  </span>
                </div>

                <div className="vendor-payout-details">
                  <div>
                    <strong>Order Amount</strong>
                    <span>
                      ₹
                      {Number(
                        payout.order_amount || 0
                      ).toFixed(2)}
                    </span>
                  </div>

                  <div>
                    <strong>Commission Rate</strong>
                    <span>
                      {Number(
                        payout.commission_rate || 0
                      )}%
                    </span>
                  </div>

                  <div>
                    <strong>Commission</strong>
                    <span>
                      ₹
                      {Number(
                        payout.commission_amount || 0
                      ).toFixed(2)}
                    </span>
                  </div>

                  <div>
                    <strong>Your Payout</strong>
                    <span className="payout-amount">
                      ₹
                      {Number(
                        payout.payout_amount || 0
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="vendor-payout-footer">
                  <span>
                    Payment Reference:{" "}
                    {payout.payment_reference ||
                      "Not available"}
                  </span>

                  <span>
                    {payout.created_at
                      ? new Date(
                          payout.created_at
                        ).toLocaleString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default VendorPayouts;