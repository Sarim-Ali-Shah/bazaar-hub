import React from 'react';
import { useNavigate } from 'react-router-dom';
import useCart from '../hooks/useCart';

const CartPage = () => {
  const { cartItems, removeFromCart, getTotalPrice } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-8 text-center min-h-[80vh]">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600">Time to find some great deals!</p>
        <button onClick={() => navigate('/')} className="mt-6 bg-bazaar-primary text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition">
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto min-h-[80vh]">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-2">Your Shopping Cart ({cartItems.length} items)</h1>
      
      <div className="bg-white shadow-xl rounded-xl p-6">
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item._id} className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0">
              <div className="flex items-center space-x-4">
                <img 
                  src={item.image || "https://via.placeholder.com/60?text=Item"} 
                  alt={item.title} 
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <p className="text-lg font-bold text-bazaar-primary">${(item.price * item.quantity).toFixed(2)}</p>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 pt-4 border-t-2 border-dashed border-gray-200 flex justify-between items-center">
          <p className="text-xl font-bold text-gray-900">Total Price:</p>
          <p className="text-2xl font-extrabold text-bazaar-primary">${getTotalPrice().toFixed(2)}</p>
        </div>

        <div className="mt-6">
          <button
            onClick={handleCheckout}
            className="w-full bg-bazaar-primary text-white text-lg font-bold py-3 rounded-lg shadow-lg hover:bg-indigo-700 transition duration-150"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;