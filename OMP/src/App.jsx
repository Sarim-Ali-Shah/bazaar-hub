import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProductDetailsPage from './pages/ProductDetailsPage';

// Buyer-Specific Pages
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';

// Seller-Specific Pages
import AddEditProductPage from './pages/AddEditProductPage';
import MyProductsPage from './pages/MyProductsPage';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* -------------------- Public Routes -------------------- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />

          {/* -------------------- Protected Routes -------------------- */}
          
          {/* Buyer Routes */}
          <Route element={<ProtectedRoute allowedRoles={['buyer']} />}>
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrdersPage />} />
          </Route>
          
          {/* Seller Routes */}
          <Route element={<ProtectedRoute allowedRoles={['seller']} />}>
            <Route path="/add-product" element={<AddEditProductPage />} />
            <Route path="/edit-product/:id" element={<AddEditProductPage />} />
            <Route path="/my-products" element={<MyProductsPage />} />
          </Route>

          {/* Fallback 404 Route */}
          <Route path="*" element={
            <>
              <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-6xl font-extrabold text-bazaar-primary">404</h1>
                <p className="text-xl text-gray-600 mt-4">Page Not Found</p>
                <a href="/" className="mt-8 text-bazaar-primary hover:underline">Go Home</a>
              </div>
            </>
          } />
          
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;