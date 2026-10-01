import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

// Authentication
import Login from "./pages/Login";
import Register from "./pages/Register";
import Forbidden from "./pages/Forbidden";

// Buyer
import BuyerProducts from "./pages/BuyerProducts";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import BuyerOrders from "./pages/BuyerOrders";
import BuyerOrderDetails from "./pages/BuyerOrderDetails";

// Vendor
import VendorDashboard from "./pages/VendorDashboard";
import VendorProducts from "./pages/VendorProducts";
import VendorOrders from "./pages/VendorOrders";
import VendorStock from "./pages/VendorStock";
import VendorPayouts from "./pages/VendorPayouts";

//Admin
import AdminDashboard from "./pages/AdminDashboard";
import AdminVendorManagement from "./pages/AdminVendorManagement";
import AdminProductManagement from "./pages/AdminProductManagement";
import AdminOrderManagement from "./pages/AdminOrderManagement";
import AdminPayoutManagement from "./pages/AdminPayoutManagement";
import AdminReports from "./pages/AdminReports";







function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* ================= DEFAULT ================= */}

          <Route
            path="/"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />

          {/* ================= AUTHENTICATION ================= */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/403"
            element={<Forbidden />}
          />

          {/* ================= BUYER ================= */}

          <Route
            path="/buyer/products"
            element={
              <ProtectedRoute allowedRoles={["buyer"]}>
                <BuyerProducts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/buyer/products/:id"
            element={
              <ProtectedRoute allowedRoles={["buyer"]}>
                <ProductDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/buyer/cart"
            element={
              <ProtectedRoute allowedRoles={["buyer"]}>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/buyer/checkout"
            element={
              <ProtectedRoute allowedRoles={["buyer"]}>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/buyer/orders"
            element={
              <ProtectedRoute allowedRoles={["buyer"]}>
                <BuyerOrders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/buyer/orders/:id"
            element={
              <ProtectedRoute allowedRoles={["buyer"]}>
                <BuyerOrderDetails />
              </ProtectedRoute>
            }
          />

          {/* ================= VENDOR ================= */}

          <Route
            path="/vendor/dashboard"
            element={
              <ProtectedRoute allowedRoles={["vendor"]}>
                <VendorDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/vendor/products"
            element={
              <ProtectedRoute allowedRoles={["vendor"]}>
                <VendorProducts />
              </ProtectedRoute>
            }
          />

           <Route
            path="/vendor/orders"
            element={
              <ProtectedRoute allowedRoles={["vendor"]}>
                <VendorOrders />
              </ProtectedRoute>
            }
          />
              <Route
            path="/vendor/stock"
            element={
              <ProtectedRoute allowedRoles={["vendor"]}>
                <VendorStock />
              </ProtectedRoute>
            }
          />
               <Route
            path="/vendor/payouts"
            element={
              <ProtectedRoute allowedRoles={["vendor"]}>
                <VendorPayouts />
              </ProtectedRoute>
            }
          />

          {/* ================= ADMIN ================= */}

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard/>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/vendors"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminVendorManagement/>
              </ProtectedRoute>
            }
          />
      

          <Route
            path="/admin/products"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminProductManagement/>
              </ProtectedRoute>
            }
          />

           <Route
            path="/admin/orders"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminOrderManagement/>
              </ProtectedRoute>
            }
          />

           <Route
            path="/admin/payouts"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPayoutManagement/>
              </ProtectedRoute>
            }
          />
              <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminReports/>
              </ProtectedRoute>
            }
          />



          {/* ================= UNKNOWN ROUTE ================= */}

          <Route
            path="*"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;