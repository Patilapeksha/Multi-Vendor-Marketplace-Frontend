import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/AdminReports.css";

const AdminReports = () => {
  const navigate = useNavigate();

  const [salesReport, setSalesReport] = useState(null);
  const [orderReport, setOrderReport] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReports = async () => {
    try {
      setLoading(true);
      setError("");

      const [salesResponse, ordersResponse] =
        await Promise.all([
          api.get("/reports/admin/sales"),
          api.get("/reports/admin/orders")
        ]);

      setSalesReport(
        salesResponse.data
      );

      setOrderReport(
        ordersResponse.data
      );
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load reports"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const downloadOrdersCsv = async () => {
    try {
      const response = await api.get(
        "/reports/admin/orders/csv",
        {
          responseType: "blob"
        }
      );

      const blob = new Blob(
        [response.data],
        {
          type: "text/csv"
        }
      );

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;
      link.download = "admin-orders-report.csv";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to download CSV report"
      );
    }
  };

  const getValue = (source, keys) => {
    for (const key of keys) {
      if (
        source &&
        source[key] !== undefined &&
        source[key] !== null
      ) {
        return source[key];
      }
    }

    return 0;
  };

  const sales = salesReport || {};
  const orders = orderReport || {};

  const totalSales = getValue(
    sales,
    [
      "total_sales",
      "total_revenue",
      "sales",
      "revenue"
    ]
  );

  const totalOrders = getValue(
    orders,
    [
      "total_orders",
      "orders_count",
      "order_count"
    ]
  );

  const pendingOrders = getValue(
    orders,
    [
      "pending_orders",
      "pending"
    ]
  );

  const completedOrders = getValue(
    orders,
    [
      "completed_orders",
      "delivered_orders",
      "delivered"
    ]
  );

  return (
    <div className="admin-reports-page">

      <header className="admin-reports-header">

        <div>
          <h1>Multi-Vendor Marketplace</h1>
          <p>Admin Reports</p>
        </div>

        <div className="admin-reports-actions">

          <button
            onClick={() =>
              navigate("/admin/dashboard")
            }
          >
            Dashboard
          </button>

          <button
            onClick={() =>
              navigate("/admin/orders")
            }
          >
            Orders
          </button>

          <button
            onClick={() =>
              navigate("/admin/payouts")
            }
          >
            Payouts
          </button>

        </div>

      </header>

      <main className="admin-reports-container">

        <section className="admin-reports-title">

          <h2>Marketplace Reports</h2>

          <p>
            Review marketplace sales,
            order performance and export data.
          </p>

        </section>

        {error && (
          <div className="admin-reports-error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="admin-reports-loading">
            Loading reports...
          </div>
        ) : (
          <>
            <section className="admin-report-stats">

              <div className="admin-report-card">
                <div className="admin-report-icon">
                  💰
                </div>

                <div>
                  <h3>Total Sales</h3>

                  <strong>
                    ₹
                    {Number(
                      totalSales || 0
                    ).toLocaleString(
                      "en-IN",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      }
                    )}
                  </strong>
                </div>
              </div>

              <div className="admin-report-card">
                <div className="admin-report-icon">
                  🛒
                </div>

                <div>
                  <h3>Total Orders</h3>

                  <strong>
                    {Number(
                      totalOrders || 0
                    )}
                  </strong>
                </div>
              </div>

              <div className="admin-report-card">
                <div className="admin-report-icon">
                  ⏳
                </div>

                <div>
                  <h3>Pending Orders</h3>

                  <strong>
                    {Number(
                      pendingOrders || 0
                    )}
                  </strong>
                </div>
              </div>

              <div className="admin-report-card">
                <div className="admin-report-icon">
                  ✅
                </div>

                <div>
                  <h3>Completed Orders</h3>

                  <strong>
                    {Number(
                      completedOrders || 0
                    )}
                  </strong>
                </div>
              </div>

            </section>

            <section className="admin-report-section">

              <div className="admin-report-section-header">

                <div>
                  <h2>Sales Report</h2>

                  <p>
                    Marketplace sales information.
                  </p>
                </div>

              </div>

              <div className="admin-report-content">

                <pre>
                  {JSON.stringify(
                    salesReport,
                    null,
                    2
                  )}
                </pre>

              </div>

            </section>

            <section className="admin-report-section">

              <div className="admin-report-section-header">

                <div>
                  <h2>Order Report</h2>

                  <p>
                    Marketplace order information.
                  </p>
                </div>

                <button
                  className="admin-download-button"
                  onClick={
                    downloadOrdersCsv
                  }
                >
                  📥 Download Orders CSV
                </button>

              </div>

              <div className="admin-report-content">

                <pre>
                  {JSON.stringify(
                    orderReport,
                    null,
                    2
                  )}
                </pre>

              </div>

            </section>
          </>
        )}

      </main>

    </div>
  );
};

export default AdminReports;