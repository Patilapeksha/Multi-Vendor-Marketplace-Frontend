import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Demo login accounts
  const demoAccounts = {
    admin: {
      email: "admin@marketplace.com",
      password: "Admin@123"
    },
    vendor: {
      email: "vendor@marketplace.com",
      password: "Vendor@123"
    },
    buyer: {
      email: "buyer@marketplace.com",
      password: "Buyer@123"
    }
  };

  const handleDemoLogin = (role) => {
    const account = demoAccounts[role];

    setEmail(account.email);
    setPassword(account.password);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const user = await login(email, password);

      // Role-based redirect
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "vendor") {
        navigate("/vendor/dashboard");
      } else if (user.role === "buyer") {
        navigate("/buyer/products");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        <div className="login-header">
          <h1>Multi-Vendor Marketplace</h1>
          <p>Login to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* DEMO LOGIN OPTIONS */}
        <div className="demo-login-section">

          <div className="demo-divider">
            <span>Demo Login</span>
          </div>

          <p className="demo-text">
            Select a role to fill demo credentials
          </p>

          <div className="demo-login-buttons">

            <button
              type="button"
              className="demo-button admin-demo"
              onClick={() => handleDemoLogin("admin")}
            >
              👨‍💼 Admin
            </button>

            <button
              type="button"
              className="demo-button vendor-demo"
              onClick={() => handleDemoLogin("vendor")}
            >
              🏪 Vendor
            </button>

            <button
              type="button"
              className="demo-button buyer-demo"
              onClick={() => handleDemoLogin("buyer")}
            >
              🛍️ Buyer
            </button>

          </div>

        </div>

        <div className="register-link">
          <p>
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
