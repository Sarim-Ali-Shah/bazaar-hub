import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, showSellerButtons = false, onEdit, onDelete }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No products found in this category.
      </div>
    );
  }

  // Uses the responsive grid layout
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map(product => (
        <ProductCard
          key={product._id}
          product={product}
          showSellerButtons={showSellerButtons}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ProductGrid;