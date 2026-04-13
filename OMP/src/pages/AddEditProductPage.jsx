import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import Input from '../components/Input';

const CATEGORIES = ['electronics', 'clothing', 'books', 'home', 'sports']; // Matches Home Page categories

const AddEditProductPage = () => {
  const { id } = useParams(); // Will be present for editing
  const isEditMode = !!id;
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: CATEGORIES[0],
    image: '', // Simplified image URL/placeholder for frontend demo
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        setLoading(true);
        try {
          const response = await api.get(`/products/${id}`);
          // Populate form with existing data
          setFormData({
            title: response.data.title,
            description: response.data.description,
            price: response.data.price,
            category: response.data.category,
            image: response.data.image || '',
          });
        } catch (err) {
          setError('Failed to fetch product for editing.');
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    // Simple validation for price to ensure it's a number
    if (id === 'price') {
      const numericValue = value.replace(/[^0-9.]/g, '');
      setFormData(prev => ({ ...prev, [id]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Basic form validation
    if (!formData.title || !formData.description || !formData.price || !formData.category) {
        setError('Please fill in all required fields.');
        setLoading(false);
        return;
    }

    const payload = { 
        ...formData, 
        price: parseFloat(formData.price) // Ensure price is a number
    };

    try {
      if (isEditMode) {
        // PUT /products/:id
        await api.put(`/products/${id}`, payload);
        alert('Product updated successfully!');
      } else {
        // POST /products
        await api.post('/products', payload);
        alert('Product added successfully!');
      }
      navigate('/my-products');
    } catch (err) {
      console.error('Product Save Error:', err);
      setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} product.`);
    } finally {
      setLoading(false);
    }
  };

  const pageTitle = isEditMode ? 'Edit Product' : 'Add New Product';

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">{pageTitle}</h1>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
      
      {loading && isEditMode && <p className="text-center text-bazaar-primary">Loading product data...</p>}
      
      {(!loading || !isEditMode) && ( // Don't show form if loading in edit mode
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Product Name"
            required
          />

          {/* Textarea for Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Detailed description of the product..."
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-bazaar-primary focus:border-bazaar-primary sm:text-sm transition duration-150"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Price ($)"
              id="price"
              type="text"
              value={formData.price}
              onChange={handleChange}
              placeholder="99.99"
              required
            />

            {/* Category Dropdown */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-bazaar-primary focus:border-bazaar-primary sm:text-sm transition duration-150"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
          
          <Input
            label="Image URL"
            id="image"
            type="text"
            value={formData.image}
            onChange={handleChange}
            placeholder="http://example.com/image.jpg (Optional)"
          />

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-bazaar-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bazaar-primary transition duration-150 disabled:opacity-50"
            >
              {loading ? (isEditMode ? 'Saving...' : 'Adding Product...') : (isEditMode ? 'Save Changes' : 'Add Product')}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddEditProductPage;