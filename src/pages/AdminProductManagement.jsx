import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/AdminProductManagement.css";

const AdminProductManagement = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/admin/products"
      );

      setProducts(response.data.products || []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const updateStatus = async (productId, status) => {
    try {
      setUpdatingId(productId);
      setError("");
      setSuccess("");

      await api.put(
        `/admin/products/${productId}/status`,
        {
          status
        }
      );

      setSuccess(
        `Product status updated to ${status}.`
      );

      await loadProducts();

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to update product status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusClass = (status) => {
    return `admin-product-status-${String(
      status || ""
    ).toLowerCase()}`;
  };

  return (
    <div className="admin-products-page">

      <header className="admin-products-header">
        <div>
          <h1>Multi-Vendor Marketplace</h1>
          <p>Admin Catalog Moderation</p>
        </div>

        <div className="admin-products-actions">
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
        </div>
      </header>

      <main className="admin-products-container">

        <section className="admin-products-title">
          <h2>Catalog Moderation</h2>

          <p>
            Review marketplace products and manage
            their catalog status.
          </p>
        </section>

        {error && (
          <div className="admin-products-error">
            {error}
          </div>
        )}

        {success && (
          <div className="admin-products-success">
            {success}
          </div>
        )}

        {loading ? (
          <div className="admin-products-message">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="admin-products-empty">
            <div className="product-empty-icon">
              📦
            </div>

            <h3>No Products Found</h3>

            <p>
              There are no products in the marketplace.
            </p>
          </div>
        ) : (
          <div className="admin-products-list">

            {products.map((product) => (

              <div
                className="admin-product-card"
                key={product.id}
              >

                <div className="admin-product-main">

                  <div className="admin-product-icon">
                    📦
                  </div>

                  <div>
                    <h3>
                      {product.title}
                    </h3>

                    <p className="product-description">
                      {product.description ||
                        "No description available"}
                    </p>

                    <span className="product-id">
                      Product ID: #{product.id}
                    </span>
                  </div>

                </div>

                <div className="admin-product-info">

                  <div>
                    <strong>Vendor</strong>

                    <span>
                      {product.vendor_name ||
                        "Unknown"}
                    </span>

                    <small>
                      {product.vendor_email ||
                        ""}
                    </small>
                  </div>

                  <div>
                    <strong>Category</strong>

                    <span>
                      {product.category_name ||
                        "Uncategorized"}
                    </span>
                  </div>

                  <div>
                    <strong>Price</strong>

                    <span>
                      ₹
                      {Number(
                        product.price || 0
                      ).toFixed(2)}
                    </span>
                  </div>

                  <div>
                    <strong>Stock</strong>

                    <span>
                      {Number(
                        product.stock_quantity || 0
                      )}
                    </span>
                  </div>

                </div>

                <div className="admin-product-status-section">

                  <div>
                    <strong>
                      Current Status
                    </strong>

                    <span
                      className={`admin-product-status ${getStatusClass(
                        product.status
                      )}`}
                    >
                      {product.status ||
                        "inactive"}
                    </span>
                  </div>

                  <div className="admin-product-control">

                    <label>
                      Change Status
                    </label>

                    <select
                      value={
                        product.status ||
                        "inactive"
                      }
                      disabled={
                        updatingId === product.id
                      }
                      onChange={(e) =>
                        updateStatus(
                          product.id,
                          e.target.value
                        )
                      }
                    >
                      <option value="active">
                        Active
                      </option>

                      <option value="inactive">
                        Inactive
                      </option>

                      <option value="removed">
                        Removed
                      </option>
                    </select>

                    {updatingId === product.id && (
                      <span className="product-updating">
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

export default AdminProductManagement;