import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/BuyerProducts.css";

const BuyerProducts = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search, categoryId]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");

      setCategories(response.data.categories || []);
    } catch (err) {
      console.error("Category error:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (search.trim()) {
        params.search = search.trim();
      }

      if (categoryId) {
        params.category_id = categoryId;
      }

      const response = await api.get("/products", {
        params
      });

      let productList = response.data.products || [];

      // Hide temporary test products
      productList = productList.filter(
        (product) =>
          product.title !== "Vendor 2 Sports Shoes" &&
          product.title !== "Updated Vendor Product" &&
          product.title !== "Unauthorized Update Test"
      );

      setProducts(productList);
    } catch (err) {
      console.error("Product error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (value) => {
    return Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="buyer-products-page">

      {/* HEADER */}

      <header className="buyer-products-header">

        <div>
          <h1>Multi-Vendor Marketplace</h1>
          <p>Browse Products</p>
        </div>

        <div className="header-actions">

          {/* CART */}

          <button
            className="cart-button"
            onClick={() => navigate("/buyer/cart")}
          >
            🛒 Cart
          </button>

          {/* MY ORDERS */}

          <button
            className="orders-button"
            onClick={() =>
              navigate("/buyer/orders")
            }
          >
            📦 My Orders
          </button>

        </div>

      </header>

      {/* MAIN */}

      <main className="buyer-products-container">

        {/* SEARCH + FILTER */}

        <div className="product-filters">

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            value={categoryId}
            onChange={(e) =>
              setCategoryId(e.target.value)
            }
          >
            <option value="">
              All Categories
            </option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>

        </div>

        {/* ERROR */}

        {error && (
          <div className="products-error">
            {error}
          </div>
        )}

        {/* LOADING */}

        {loading ? (
          <div className="products-status">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="products-status">
            No products found.
          </div>
        ) : (

          /* PRODUCT GRID */

          <div className="products-grid">

            {products.map((product) => {

              const stock = Number(
                product.stock_quantity || 0
              );

              return (
                <div
                  className="product-card"
                  key={product.id}
                >

                  {/* PRODUCT IMAGE / ICON */}

                  <div className="product-image-container">

                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.title}
                        className="product-image"
                      />
                    ) : (
                      <div className="product-placeholder">
                        📦
                      </div>
                    )}

                  </div>

                  {/* PRODUCT DETAILS */}

                  <div className="product-card-content">

                    <span className="product-category">
                      {product.category_name ||
                        "Category"}
                    </span>

                    <h3>
                      {product.title}
                    </h3>

                    <p className="product-description">
                      {product.description ||
                        "No description available"}
                    </p>

                    <div className="product-price">
                      ₹{formatPrice(product.price)}
                    </div>

                    <div className="product-stock">
                      {stock > 0
                        ? `Stock: ${stock}`
                        : "Out of Stock"}
                    </div>

                    <button
                      className="view-details-button"
                      onClick={() =>
                        navigate(
                          `/buyer/products/${product.id}`
                        )
                      }
                    >
                      View Details
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

export default BuyerProducts;
