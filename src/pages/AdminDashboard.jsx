import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({
    total_vendors: 0,
    total_products: 0,
    orders_today: 0,
    gmv: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/admin/dashboard/stats"
      );

      setDashboard(
        response.data.dashboard || {
          total_vendors: 0,
          total_products: 0,
          orders_today: 0,
          gmv: 0
        }
      );
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="admin-dashboard-page">

      <header className="admin-dashboard-header">
        <div>
          <h1>Multi-Vendor Marketplace</h1>
          <p>Admin Dashboard</p>
        </div>

        <div className="admin-dashboard-actions">
          <span className="admin-user">
            👤 Admin
          </span>

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="admin-dashboard-container">

        <section className="admin-welcome">
          <h2>Welcome, Admin!</h2>

          <p>
            Monitor and manage your marketplace
            from one place.
          </p>
        </section>

        {error && (
          <div className="admin-dashboard-error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="admin-dashboard-loading">
            Loading dashboard...
          </div>
        ) : (
          <>
            <section className="admin-stats-grid">

              <div className="admin-stat-card">
                <div className="admin-stat-icon">
                  🏪
                </div>

                <div>
                  <h3>Total Vendors</h3>

                  <strong>
                    {dashboard.total_vendors}
                  </strong>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon">
                  📦
                </div>

                <div>
                  <h3>Total Products</h3>

                  <strong>
                    {dashboard.total_products}
                  </strong>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon">
                  🛒
                </div>

                <div>
                  <h3>Orders Today</h3>

                  <strong>
                    {dashboard.orders_today}
                  </strong>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon">
                  💰
                </div>

                <div>
                  <h3>GMV</h3>

                  <strong>
                    ₹
                    {Number(
                      dashboard.gmv || 0
                    ).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </strong>
                </div>
              </div>

            </section>

            <section className="admin-management-section">

              <h2>Marketplace Management</h2>

              <div className="admin-management-grid">

                <div
                  className="admin-management-card"
                  onClick={() =>
                    navigate("/admin/vendors")
                  }
                >
                  <div>🏪</div>

                  <h3>Vendor Management</h3>

                  <p>
                    Approve and manage marketplace
                    vendors.
                  </p>

                  <button>
                    Manage Vendors →
                  </button>
                </div>

                <div
                  className="admin-management-card"
                  onClick={() =>
                    navigate("/admin/products")
                  }
                >
                  <div>📦</div>

                  <h3>Catalog Moderation</h3>

                  <p>
                    Review and manage marketplace
                    products.
                  </p>

                  <button>
                    Manage Catalog →
                  </button>
                </div>

                <div
                  className="admin-management-card"
                  onClick={() =>
                    navigate("/admin/orders")
                  }
                >
                  <div>🛒</div>

                  <h3>Order Oversight</h3>

                  <p>
                    Monitor customer orders and
                    order status.
                  </p>

                  <button>
                    View Orders →
                  </button>
                </div>

                <div
                  className="admin-management-card"
                  onClick={() =>
                    navigate("/admin/payouts")
                  }
                >
                  <div>💰</div>

                  <h3>Payout Processing</h3>

                  <p>
                    Review and process vendor
                    payouts.
                  </p>

                  <button>
                    Manage Payouts →
                  </button>
                </div>

                <div
                  className="admin-management-card"
                  onClick={() =>
                    navigate("/admin/reports")
                  }
                >
                  <div>📊</div>

                  <h3>Reports</h3>

                  <p>
                    View marketplace reports and
                    download data.
                  </p>

                  <button>
                    View Reports →
                  </button>
                </div>

              </div>

            </section>
          </>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;