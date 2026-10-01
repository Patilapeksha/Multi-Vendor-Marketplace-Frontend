import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/VendorProducts.css";

const VendorProducts = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category_id: "",
    image: null
  });

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);

      const response = await api.get("/products/my-products");

      setProducts(response.data.products || response.data || []);

    } catch (err) {
      console.error("Failed to load products:", err);

      setError(
        err.response?.data?.message ||
        "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await api.get("/categories");

      setCategories(response.data.categories || response.data || []);

    } catch (err) {
      console.error("Failed to load categories:", err);

      setError(
        err.response?.data?.message ||
        "Failed to load categories"
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp"
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, JPEG, PNG and WEBP images are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      e.target.value = "";
      return;
    }

    setError("");

    setForm({
      ...form,
      image: file
    });
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      price: "",
      category_id: "",
      image: null
    });

    setEditingProduct(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!form.title.trim()) {
      setError("Product title is required");
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      setError("Please enter a valid price");
      return;
    }

    if (!form.category_id) {
      setError("Please select a category");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("category_id", form.category_id);

      if (form.image) {
        formData.append("image", form.image);
      }

      if (editingProduct) {
        await api.put(
          `/products/${editingProduct.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        );

        setMessage("Product updated successfully");
      } else {
        await api.post(
          "/products",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        );

        setMessage("Product created successfully");
      }

      await loadProducts();

      resetForm();

    } catch (err) {
      console.error("Product save error:", err);

      setError(
        err.response?.data?.message ||
        "Failed to save product"
      );

    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);

    setForm({
      title: product.title || "",
      description: product.description || "",
      price: product.price || "",
      category_id: product.category_id || "",
      image: null
    });

    setShowForm(true);
    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      await api.delete(`/products/${id}`);

      setMessage("Product deleted successfully");

      await loadProducts();

    } catch (err) {
      console.error("Delete product error:", err);

      setError(
        err.response?.data?.message ||
        "Failed to delete product"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vendor-products-page">

      <header className="vendor-products-header">
        <div>
          <h1>Multi-Vendor Marketplace</h1>
          <p>Vendor Product Management</p>
        </div>

        <div className="header-actions">
          <button
            className="secondary-btn"
            onClick={() => navigate("/vendor/dashboard")}
          >
            Dashboard
          </button>

          <button
            className="secondary-btn"
            onClick={() => navigate("/vendor/orders")}
          >
            Orders
          </button>
        </div>
      </header>

      <main className="vendor-products-container">

        <div className="page-title-row">
          <div>
            <h2>My Products</h2>
            <p>Manage your marketplace products</p>
          </div>

          <button
            className="primary-btn"
            onClick={() => {
              setShowForm(!showForm);
              setEditingProduct(null);
              setError("");
              setMessage("");

              if (!showForm) {
                setForm({
                  title: "",
                  description: "",
                  price: "",
                  category_id: "",
                  image: null
                });
              }
            }}
          >
            {showForm ? "Cancel" : "+ Add Product"}
          </button>
        </div>

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {showForm && (
          <div className="product-form-card">

            <h3>
              {editingProduct
                ? "Edit Product"
                : "Add New Product"}
            </h3>

            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label>Product Title</label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter product title"
                />
              </div>

              <div className="form-group">
                <label>Category</label>

                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                >
                  <option value="">
                    Select Category
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

              <div className="form-group">
                <label>Price</label>

                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label>Description</label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Product Image</label>

                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                />

                <small>
                  JPG, JPEG, PNG or WEBP. Maximum 5MB.
                </small>

                {editingProduct && editingProduct.image && (
                  <div className="current-image">
                    <p>Current Image:</p>

                    <img
                      src={
                        editingProduct.image.startsWith("http")
                          ? editingProduct.image
                          : `http://localhost:5000${editingProduct.image}`
                      }
                      alt={editingProduct.title}
                    />
                  </div>
                )}

                {form.image && (
                  <p className="selected-image">
                    Selected: {form.image.name}
                  </p>
                )}
              </div>

              <div className="form-actions">

                <button
                  type="submit"
                  className="primary-btn"
                  disabled={loading}
                >
                  {loading
                    ? "Saving..."
                    : editingProduct
                    ? "Update Product"
                    : "Add Product"}
                </button>

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={resetForm}
                  disabled={loading}
                >
                  Cancel
                </button>

              </div>

            </form>
          </div>
        )}

        {loading && products.length === 0 ? (
          <div className="loading">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <h3>No Products Yet</h3>
            <p>
              Add your first product to start selling.
            </p>
          </div>
        ) : (
          <div className="products-grid">

            {products.map((product) => (

              <div
                className="product-card"
                key={product.id}
              >

                <div className="product-image-placeholder">

                  {product.image ? (
                    <img
                      src={
                        product.image.startsWith("http")
                          ? product.image
                          : `http://localhost:5000${product.image}`
                      }
                      alt={product.title}
                    />
                  ) : (
                    <span>📦</span>
                  )}

                </div>

                <div className="product-card-content">

                  <h3>{product.title}</h3>

                  <p className="product-category">
                    {product.category_name ||
                      product.category ||
                      "Category"}
                  </p>

                  <p className="product-description">
                    {product.description ||
                      "No description available"}
                  </p>

                  <div className="product-info">

                    <strong>
                      ₹{Number(product.price).toFixed(2)}
                    </strong>

                    <span>
                      Stock:{" "}
                      {product.stock_quantity ?? 0}
                    </span>

                  </div>

                  <div className="product-actions">

                    <button
                      className="edit-btn"
                      onClick={() =>
                        handleEdit(product)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(product.id)
                      }
                    >
                      Delete
                    </button>

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

export default VendorProducts;