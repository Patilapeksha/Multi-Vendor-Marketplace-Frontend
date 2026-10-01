import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/VendorDashboard.css";

const VendorDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="vendor-dashboard-page">

      {/* HEADER */}
      <header className="vendor-dashboard-header">

        <div>
          <h1>Multi-Vendor Marketplace</h1>
          <p>Vendor Dashboard</p>
        </div>

        <div className="vendor-header-actions">

          <span className="vendor-user">
            👤 {user?.name || "Vendor"}
          </span>

          <button onClick={handleLogout}>
            Logout
          </button>

        </div>

      </header>

      {/* MAIN CONTENT */}
      <main className="vendor-dashboard-container">

        <section className="vendor-welcome">

          <h2>
            Welcome, {user?.name || "Vendor"}!
          </h2>

          <p>
            Manage your products, inventory,
            orders and payouts from here.
          </p>

        </section>

        {/* DASHBOARD CARDS */}
        <div className="vendor-dashboard-grid">

          {/* PRODUCTS */}
          <div
            className="vendor-dashboard-card"
            onClick={() => navigate("/vendor/products")}
          >

            <div className="vendor-card-icon">
              📦
            </div>

            <h3>My Products</h3>

            <p>
              Add, edit and manage your products.
            </p>

            <button>
              Manage Products →
            </button>

          </div>

          {/* ORDERS */}
          <div
            className="vendor-dashboard-card"
            onClick={() => navigate("/vendor/orders")}
          >

            <div className="vendor-card-icon">
              🛒
            </div>

            <h3>Orders</h3>

            <p>
              View and fulfill customer orders.
            </p>

            <button>
              Manage Orders →
            </button>

          </div>

          {/* STOCK */}
          <div
            className="vendor-dashboard-card"
            onClick={() => navigate("/vendor/stock")}
          >

            <div className="vendor-card-icon">
              📊
            </div>

            <h3>Stock Management</h3>

            <p>
              Monitor and update product inventory.
            </p>

            <button>
              Manage Stock →
            </button>

          </div>

          {/* PAYOUTS */}
          <div
            className="vendor-dashboard-card"
            onClick={() => navigate("/vendor/payouts")}
          >

            <div className="vendor-card-icon">
              💰
            </div>

            <h3>Payouts</h3>

            <p>
              View your earnings and payout details.
            </p>

            <button>
              View Payouts →
            </button>

          </div>

        </div>

        {/* RESPONSIBILITIES */}
        <section className="vendor-info-section">

          <h2>
            Vendor Responsibilities
          </h2>

          <div className="vendor-info-grid">

            <div>
              <strong>📦 Products</strong>
              <span>
                Maintain your product catalog.
              </span>
            </div>

            <div>
              <strong>📊 Inventory</strong>
              <span>
                Keep stock quantities updated.
              </span>
            </div>

            <div>
              <strong>🚚 Fulfillment</strong>
              <span>
                Process and fulfill customer orders.
              </span>
            </div>

            <div>
              <strong>💰 Earnings</strong>
              <span>
                Track commissions and payouts.
              </span>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
};

export default VendorDashboard;