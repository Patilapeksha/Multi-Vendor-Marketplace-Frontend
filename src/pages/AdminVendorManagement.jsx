import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/AdminVendorManagement.css";

const AdminVendorManagement = () => {
  const navigate = useNavigate();

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [success, setSuccess] = useState("");

  const loadVendors = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/vendors");

      setVendors(response.data.vendors || []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load vendors"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

  const updateStatus = async (vendorId, status) => {
    try {
      setUpdatingId(vendorId);
      setError("");
      setSuccess("");

      await api.put(
        `/admin/vendors/${vendorId}/status`,
        {
          status
        }
      );

      setSuccess(
        `Vendor status updated to ${status}.`
      );

      await loadVendors();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to update vendor status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusClass = (status) => {
    return `vendor-status-${String(status || "")
      .toLowerCase()
      .replace(/\s+/g, "-")}`;
  };

  return (
    <div className="admin-vendors-page">

      <header className="admin-vendors-header">
        <div>
          <h1>Multi-Vendor Marketplace</h1>
          <p>Admin Vendor Management</p>
        </div>

        <div className="admin-vendors-actions">
          <button
            onClick={() =>
              navigate("/admin/dashboard")
            }
          >
            Dashboard
          </button>
        </div>
      </header>

      <main className="admin-vendors-container">

        <section className="admin-vendors-title">
          <h2>Vendor Management</h2>

          <p>
            Approve, reject, suspend and manage
            marketplace vendors.
          </p>
        </section>

        {error && (
          <div className="admin-vendors-error">
            {error}
          </div>
        )}

        {success && (
          <div className="admin-vendors-success">
            {success}
          </div>
        )}

        {loading ? (
          <div className="admin-vendors-message">
            Loading vendors...
          </div>
        ) : vendors.length === 0 ? (
          <div className="admin-vendors-empty">
            <div className="vendor-empty-icon">
              🏪
            </div>

            <h3>No Vendors Found</h3>

            <p>
              There are no vendor accounts yet.
            </p>
          </div>
        ) : (
          <div className="admin-vendors-list">

            {vendors.map((vendor) => (

              <div
                className="admin-vendor-card"
                key={vendor.id}
              >

                <div className="admin-vendor-info">

                  <div className="vendor-avatar">
                    {vendor.name
                      ? vendor.name
                          .charAt(0)
                          .toUpperCase()
                      : "V"}
                  </div>

                  <div>
                    <h3>
                      {vendor.name ||
                        "Vendor"}
                    </h3>

                    <p>
                      {vendor.email}
                    </p>

                    <span>
                      Vendor ID: #{vendor.id}
                    </span>
                  </div>

                </div>

                <div className="admin-vendor-status">

                  <span
                    className={`vendor-status ${getStatusClass(
                      vendor.vendor_status
                    )}`}
                  >
                    {vendor.vendor_status ||
                      "pending"}
                  </span>

                </div>

                <div className="admin-vendor-controls">

                  <label>
                    Vendor Status
                  </label>

                  <select
                    value={
                      vendor.vendor_status ||
                      "pending"
                    }
                    disabled={
                      updatingId === vendor.id
                    }
                    onChange={(e) =>
                      updateStatus(
                        vendor.id,
                        e.target.value
                      )
                    }
                  >
                    <option value="pending">
                      Pending
                    </option>

                    <option value="approved">
                      Approved
                    </option>

                    <option value="rejected">
                      Rejected
                    </option>

                    <option value="suspended">
                      Suspended
                    </option>
                  </select>

                  {updatingId === vendor.id && (
                    <span className="vendor-updating">
                      Updating...
                    </span>
                  )}

                </div>

                <div className="admin-vendor-date">

                  <strong>
                    Registered
                  </strong>

                  <span>
                    {vendor.created_at
                      ? new Date(
                          vendor.created_at
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

export default AdminVendorManagement;