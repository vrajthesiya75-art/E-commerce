import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { CartProvider } from "./context/CartContext";
import Login from "./features/auth/Login";
import PrivateRoute from "./features/auth/PrivateRoute";
import ProductList from "./features/products/ProductList";
import ProductDetail from "./features/products/ProductDetails";
import CartPage from "./features/cart/CartPage";
import CheckoutPage from "./features/checkout/CheckoutPage";
import PageTransition from "./components/PageTransition";
import "bootstrap/dist/css/bootstrap.min.css";

function AppRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/login"
          element={
            <PageTransition>
              <Login />
            </PageTransition>
          }
        />

        <Route
          path="/products"
          element={
            <PrivateRoute>
              <PageTransition>
                <ProductList />
              </PageTransition>
            </PrivateRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <PrivateRoute>
              <PageTransition>
                <ProductDetail />
              </PageTransition>
            </PrivateRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <PageTransition>
                <CartPage />
              </PageTransition>
            </PrivateRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <PageTransition>
                <CheckoutPage />
              </PageTransition>
            </PrivateRoute>
          }
        />

        <Route
          path="*"
          element={
            <PageTransition>
              <h2 className="text-center py-5">Page Not Found</h2>
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
