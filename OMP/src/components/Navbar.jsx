import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout, isSeller, isBuyer } = useAuth();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-3xl font-extrabold text-bazaar-primary">
              Bazaar<span className='text-gray-700'>Hub</span>
            </Link>
          </div>

          {/* Nav Links & Auth */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-bazaar-primary text-base font-medium transition duration-150">Home</Link>
            
            {isBuyer && (
              <>
                <Link to="/cart" className="text-gray-600 hover:text-bazaar-primary text-base font-medium transition">Cart</Link>
                <Link to="/orders" className="text-gray-600 hover:text-bazaar-primary text-base font-medium transition">Orders</Link>
              </>
            )}

            {isSeller && (
              <>
                <Link to="/add-product" className="text-gray-600 hover:text-bazaar-primary text-base font-medium transition">Add Product</Link>
                <Link to="/my-products" className="text-gray-600 hover:text-bazaar-primary text-base font-medium transition">My Products</Link>
              </>
            )}

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4 ml-4">
                <span className="text-sm font-medium text-gray-700 hidden sm:block">{user.name}</span>
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="text-gray-700 hover:text-bazaar-primary px-3 py-2 text-sm font-medium">Login</Link>
                <Link to="/signup" className="bg-bazaar-primary hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md transition duration-200">
                  Signup
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav> 
  );
};

export default Navbar;