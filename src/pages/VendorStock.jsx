import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/VendorStock.css";

const VendorStock = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [stockValues, setStockValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/products/my-products");

      const vendorProducts = response.data.products || [];

      setProducts(vendorProducts);

      const stockData = {};

      await Promise.all(
        vendorProducts.map(async (product) => {
          try {
            const stockResponse = await api.get(
              `/stock/${product.id}`
            );

            // Backend returns:
            // response.data.product.stock
            const stock =
              stockResponse.data.product?.stock ?? 0;

            stockData[product.id] = Number(stock);
          } catch (err) {
            console.error(
              `Failed to load stock for product ${product.id}`,
              err
            );

            stockData[product.id] =
              Number(product.stock_quantity) || 0;
          }
        })
      );

      setStockValues(stockData);
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

  const handleStockChange = (productId, value) => {
    setStockValues((previous) => ({
      ...previous,
      [productId]: value
    }));
  };

  const updateStock = async (productId) => {
    const stock = Number(stockValues[productId]);

    if (!Number.isInteger(stock) || stock < 0) {
      setError(
        "Stock quantity must be a whole number greater than or equal to 0."
      );
      setSuccess("");
      return;
    }

    try {
      setUpdatingId(productId);
      setError("");
      setSuccess("");

      // IMPORTANT:
      // Backend expects { stock: ... }
      await api.put(`/stock/${productId}`, {
        stock: stock
      });

      setStockValues((previous) => ({
        ...previous,
        [productId]: stock
      }));

      setSuccess("Stock updated successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to update stock"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="vendor-stock-page">
      <header className="vendor-stock-header">
        <div>
          <h1>Multi-Vendor Marketplace</h1>
          <p>Vendor Stock Management</p>
        </div>

        <div className="vendor-stock-actions">
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

      <main className="vendor-stock-container">
        <section className="vendor-stock-title">
          <h2>Stock Management</h2>
          <p>
            Monitor and update inventory for your products.
          </p>
        </section>

        {error && (
          <div className="vendor-stock-error">
            {error}
          </div>
        )}

        {success && (
          <div className="vendor-stock-success">
            {success}
          </div>
        )}

        {loading ? (
          <div className="vendor-stock-message">
            Loading stock...
          </div>
        ) : products.length === 0 ? (
          <div className="vendor-stock-empty">
            <div className="stock-empty-icon">📦</div>

            <h3>No Products Found</h3>

            <p>
              Add products first to manage their stock.
            </p>

            <button
              onClick={() =>
                navigate("/vendor/products")
              }
            >
              Manage Products
            </button>
          </div>
        ) : (
          <div className="vendor-stock-list">
            {products.map((product) => {
              const stock = Number(
                stockValues[product.id] ?? 0
              );

              return (
                <div
                  className="vendor-stock-card"
                  key={product.id}
                >
                  <div className="vendor-stock-product">
                    <div className="vendor-stock-image">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.title}
                        />
                      ) : (
                        <span>📦</span>
                      )}
                    </div>

                    <div>
                      <h3>{product.title}</h3>

                      <p>
                        Product ID: #{product.id}
                      </p>

                      <span
                        className={
                          stock === 0
                            ? "stock-badge out-of-stock"
                            : stock <= 5
                            ? "stock-badge low-stock"
                            : "stock-badge in-stock"
                        }
                      >
                        {stock === 0
                          ? "Out of Stock"
                          : stock <= 5
                          ? "Low Stock"
                          : "In Stock"}
                      </span>
                    </div>
                  </div>

                  <div className="vendor-stock-control">
                    <label
                      htmlFor={`stock-${product.id}`}
                    >
                      Stock Quantity
                    </label>

                    <input
                      id={`stock-${product.id}`}
                      type="number"
                      min="0"
                      step="1"
                      value={
                        stockValues[product.id] ?? ""
                      }
                      onChange={(e) =>
                        handleStockChange(
                          product.id,
                          e.target.value
                        )
                      }
                    />

                    <button
                      onClick={() =>
                        updateStock(product.id)
                      }
                      disabled={
                        updatingId === product.id
                      }
                    >
                      {updatingId === product.id
                        ? "Updating..."
                        : "Update Stock"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default VendorStock;