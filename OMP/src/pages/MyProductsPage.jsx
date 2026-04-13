import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ProductGrid from '../components/ProductGrid';

const MyProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchMyProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Assuming the backend has a protected GET /products endpoint 
      // that returns only the logged-in seller's products when no query is specified
      const response = await api.get('/products/my-products'); 
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching my products:', err);
      setError('Failed to load your products. Please ensure your backend is running.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const handleEdit = (id) => {
    navigate(`/edit-product/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      // DELETE /products/:id
      await api.delete(`/products/${id}`);
      alert('Product deleted successfully!');
      // Refresh the list
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      console.error('Deletion Error:', err);
      alert('Failed to delete product.');
    }
  };


  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-2">My Product Listings</h1>
      
      {loading && <p className="text-center text-lg text-bazaar-primary">Loading your products...</p>}
      {error && <p className="text-center text-lg text-red-500">{error}</p>}
      
      {!loading && !error && (
        <ProductGrid 
          products={products} 
          showSellerButtons={true} // Crucial to enable Edit/Delete buttons
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      {!loading && products.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          You have no products listed. <button onClick={() => navigate('/add-product')} className="text-bazaar-primary font-medium hover:underline">Add one now!</button>
        </div>
      )}
    </>
  );
};

export default MyProductsPage;