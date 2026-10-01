import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/AdminPayoutManagement.css";

const AdminPayoutManagement = () => {
  const navigate = useNavigate();

  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadPayouts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/payouts");

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

  useEffect(() => {
    loadPayouts();
  }, []);

  const updateStatus = async (payoutId, status) => {
    try {
      setUpdatingId(payoutId);
      setError("");
      setSuccess("");

      await api.put(
        `/admin/payouts/${payoutId}/status`,
        {
          status
        }
      );

      setSuccess(
        `Payout #${payoutId} status updated to ${status}.`
      );

      await loadPayouts();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to update payout status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusClass = (status) => {
    return `admin-payout-status-${String(
      status || ""
    ).toLowerCase()}`;
  };

  return (
    <div className="admin-payouts-page">

      <header className="admin-payouts-header">

        <div>
          <h1>Multi-Vendor Marketplace</h1>
          <p>Admin Payout Processing</p>
        </div>

        <div className="admin-payouts-actions">

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
              navigate("/admin/orders")
            }
          >
            Orders
          </button>

        </div>

      </header>

      <main className="admin-payouts-container">

        <section className="admin-payouts-title">

          <h2>Payout Processing</h2>

          <p>
            Review vendor payouts and manage
            payout processing status.
          </p>

        </section>

        {error && (
          <div className="admin-payouts-error">
            {error}
          </div>
        )}

        {success && (
          <div className="admin-payouts-success">
            {success}
          </div>
        )}

        {loading ? (
          <div className="admin-payouts-message">
            Loading payouts...
          </div>
        ) : payouts.length === 0 ? (
          <div className="admin-payouts-empty">

            <div className="admin-payout-empty-icon">
              💰
            </div>

            <h3>No Payouts Found</h3>

            <p>
              There are currently no vendor payouts.
            </p>

          </div>
        ) : (
          <div className="admin-payouts-list">

            {payouts.map((payout) => (

              <div
                className="admin-payout-card"
                key={payout.id}
              >

                <div className="admin-payout-main">

                  <div className="admin-payout-icon">
                    💰
                  </div>

                  <div>

                    <h3>
                      Payout #{payout.id}
                    </h3>

                    <span>
                      Order #{payout.order_id}
                    </span>

                  </div>

                </div>

                <div className="admin-payout-info">

                  <div>
                    <strong>Vendor ID</strong>

                    <span>
                      #{payout.vendor_id}
                    </span>
                  </div>

                  <div>
                    <strong>Order Amount</strong>

                    <span>
                      ₹
                      {Number(
                        payout.order_amount || 0
                      ).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </span>
                  </div>

                  <div>
                    <strong>Commission</strong>

                    <span>
                      ₹
                      {Number(
                        payout.commission_amount || 0
                      ).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </span>

                    <small>
                      {payout.commission_rate || 0}%
                    </small>
                  </div>

                  <div>
                    <strong>Vendor Payout</strong>

                    <span>
                      ₹
                      {Number(
                        payout.payout_amount || 0
                      ).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </span>
                  </div>

                  <div>
                    <strong>Payment Reference</strong>

                    <span>
                      {payout.payment_reference ||
                        "Not available"}
                    </span>
                  </div>

                </div>

                <div className="admin-payout-status-section">

                  <div>

                    <strong>
                      Current Status
                    </strong>

                    <span
                      className={`admin-payout-status ${getStatusClass(
                        payout.status
                      )}`}
                    >
                      {payout.status || "pending"}
                    </span>

                  </div>

                  <div className="admin-payout-control">

                    <label>
                      Change Status
                    </label>

                    <select
                      value={
                        payout.status || "pending"
                      }
                      disabled={
                        updatingId === payout.id
                      }
                      onChange={(e) =>
                        updateStatus(
                          payout.id,
                          e.target.value
                        )
                      }
                    >

                      <option value="pending">
                        Pending
                      </option>

                      <option value="processing">
                        Processing
                      </option>

                      <option value="paid">
                        Paid
                      </option>

                      <option value="failed">
                        Failed
                      </option>

                    </select>

                    {updatingId === payout.id && (
                      <span className="admin-payout-updating">
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

export default AdminPayoutManagement;