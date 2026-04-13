import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCart from '../hooks/useCart';
import api from '../api/axios';

const CheckoutPage = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const totalPrice = getTotalPrice();

  // Simple hardcoded address/payment details for academic demo
  const [shippingAddress, setShippingAddress] = useState('123 React Street, Tailwind City, JS 90210');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  if (cartItems.length === 0) {
    return <div className="text-center py-10 text-gray-500 min-h-[80vh]">Your cart is empty. Nothing to checkout.</div>;
  }

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError(null);
    
    const orderDetails = {
      items: cartItems.map(item => ({
        product: item._id,
        quantity: item.quantity,
        priceAtPurchase: item.price,
      })),
      totalAmount: totalPrice,
      shippingAddress,
      paymentMethod,
    };

    try {
      // POST /orders
      const response = await api.post('/orders', orderDetails);
      
      // Clear cart on successful order
      clearCart();
      alert(`Order Placed Successfully! Order ID: ${response.data.orderId}`);
      navigate('/orders');
      
    } catch (err) {
      console.error('Order Error:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto min-h-[80vh]">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-2">Final Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Order Summary (Left/Top) */}
        <div className="lg:col-span-2 bg-white shadow-xl rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Order Summary</h2>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="flex justify-between items-center text-sm border-b pb-2">
                <p className="text-gray-600">{item.title} (x{item.quantity})</p>
                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t-2 border-bazaar-primary flex justify-between items-center">
            <p className="text-xl font-bold text-gray-900">Order Total</p>
            <p className="text-2xl font-extrabold text-bazaar-primary">${totalPrice.toFixed(2)}</p>
          </div>
        </div>

        {/* Payment & Action (Right/Bottom) */}
        <div className="lg:col-span-1 bg-white shadow-xl rounded-xl p-6 border-t-4 border-bazaar-primary">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Confirm Details</h2>
          
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm" role="alert">{error}</div>}

          <div className="space-y-4">
            {/* Shipping Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
              <textarea
                id="address"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                rows="3"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-bazaar-primary focus:border-bazaar-primary sm:text-sm"
              ></textarea>
            </div>
            
            {/* Payment Method */}
            <div>
              <label htmlFor="payment" className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <select
                id="payment"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-bazaar-primary focus:border-bazaar-primary sm:text-sm"
              >
                <option>Credit Card</option>
                <option>PayPal</option>
                <option>Bank Transfer</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={handlePlaceOrder}
            disabled={loading || totalPrice === 0}
            className="w-full mt-6 bg-bazaar-secondary text-gray-900 text-lg font-bold py-3 rounded-lg shadow-md hover:bg-amber-400 transition duration-150 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Place Order Now'}
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default CheckoutPage;