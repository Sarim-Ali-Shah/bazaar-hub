import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, showSellerButtons, onEdit, onDelete }) => {
  const imageUrl = product.image || "https://via.placeholder.com/300x200?text=BazaarHub+Product";

  return (
    <div className="bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl border border-gray-100">
      
      {/* Product Image */}
      <div className="relative h-48 w-full">
        <img
          className="w-full h-full object-cover p-3"
          src={imageUrl}
          alt={product.title}
        />
      </div>
      
      <div className="p-4 border-t border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 truncate">{product.title}</h3>
        <p className="text-bazaar-primary font-bold mt-1 text-xl">${product.price.toFixed(2)}</p>
        <p className="text-sm text-gray-500 mt-1 capitalize">{product.category}</p>
        
        <div className="mt-4 flex flex-col space-y-2">
          <Link
            to={`/product/${product._id}`}
            className="w-full text-center bg-bazaar-primary text-white py-2.5 rounded-lg hover:bg-indigo-700 transition duration-150 text-base font-medium shadow-md"
          >
            View Details
          </Link>
          
          {showSellerButtons && (
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(product._id)}
                className="flex-1 text-center border border-bazaar-primary text-bazaar-primary py-2 rounded-lg hover:bg-indigo-50 transition duration-150 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(product._id)}
                className="flex-1 text-center bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-150 text-sm"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;