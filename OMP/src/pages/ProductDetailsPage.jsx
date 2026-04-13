import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useCart from '../hooks/useCart';
import { useAuth } from '../context/AuthContext';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const { isBuyer } = useAuth(); // To conditionally show the Add to Cart button

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      alert(`${product.title} added to cart!`);
    }
  };

  if (loading) return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-xl text-bazaar-primary min-h-[80vh]">Loading product...</div>
      <Footer />
    </>
  );
  if (error) return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-xl text-red-500 min-h-[80vh]">{error}</div>
      <Footer />
    </>
  );
  if (!product) return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-xl text-gray-500 min-h-[80vh]">Product not found.</div>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[80vh]">
        <div className="bg-white shadow-xl rounded-xl p-8 lg:flex lg:space-x-10">
          
          {/* Product Image */}
          <div className="lg:w-1/2 mb-6 lg:mb-0">
            <img
              src={product.image || "https://via.placeholder.com/600x400?text=BazaarHub+Product"}
              alt={product.title}
              className="w-full h-auto rounded-lg shadow-md object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{product.title}</h1>
            <p className="text-2xl font-bold text-bazaar-primary mb-4">${product.price.toFixed(2)}</p>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{product.description}</p>
            </div>
            
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Category:</span> <span className="capitalize">{product.category}</span>
              </p>
              <p className="text-sm text-gray-700 mt-1">
                <span className="font-semibold">Seller:</span> {product.seller?.name || 'Unknown Seller'}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                <span className="font-semibold">Contact:</span> {product.seller?.email || 'N/A'}
              </p>
            </div>

            {/* Add to Cart Button (Buyer only) */}
            {isBuyer && (
              <button
                onClick={handleAddToCart}
                className="w-full sm:w-auto bg-bazaar-secondary text-gray-900 text-lg font-bold py-3 px-6 rounded-lg shadow-md hover:bg-amber-400 transition duration-200"
              >
                Add to Cart
              </button>
            )}
            
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetailsPage;