import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import ProductGrid from '../components/ProductGrid';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const CATEGORIES = ['electronics', 'clothing', 'books', 'home', 'sports']; 

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("Failed to load products. Please try again."); // Initialized to show error state for testing
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      // NOTE: Remove the setError initialized value after testing is complete.
      // setError(null); 
      try {
        const response = await api.get('/products', {
          params: {
            search: searchQuery,
            category: selectedCategory === 'all' ? '' : selectedCategory,
          }
        });
        setProducts(response.data);
        setError(null); // Clear error on success
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, selectedCategory]);
  

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);


  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[80vh] bg-bazaar-bg">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 pt-4">All Products</h1>

        {/* --- Search and Filter Bar (Attractive Layout) --- */}
        <div className="flex flex-col items-center mb-10">
          {/* Search Input */}
          <div className="relative w-full max-w-xl mb-4 shadow-lg rounded-full">
            <input
              type="text"
              placeholder="Search products by title..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-5 pr-16 py-3 border border-gray-300 rounded-full focus:ring-bazaar-primary focus:border-bazaar-primary transition duration-150 text-lg"
            />
            <button className="absolute right-0 top-0 h-full w-14 bg-bazaar-primary text-white rounded-r-full flex items-center justify-center hover:bg-indigo-700 transition duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
            </button>
          </div>
          
          {/* Category Filter Dropdown */}
          <div className="w-full max-w-xs shadow-md">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-bazaar-primary focus:border-bazaar-primary transition duration-150 text-center text-lg font-medium"
              style={{ paddingRight: '2rem' }} // Add space for the dropdown arrow
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* --- Product Display --- */}
        {loading && <p className="text-center text-xl text-bazaar-primary">Loading products...</p>}
        {error && (
          <div className="text-center py-10">
            <p className="text-xl font-bold text-red-600 mb-2">{error}</p>
            <p className="text-gray-600">Please ensure your backend server is running and the API path is correct.</p>
          </div>
        )}
        {!loading && !error && <ProductGrid products={products} />}

      </main>
      <Footer />
    </>
  );
};

export default HomePage;