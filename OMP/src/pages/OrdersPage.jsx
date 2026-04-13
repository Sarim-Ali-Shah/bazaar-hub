import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        // GET /orders
        const response = await api.get('/orders');
        // Sort by newest first
        const sortedOrders = response.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        setOrders(sortedOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load your orders.');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);
  
  // Helper to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  if (loading) return <div className="max-w-4xl mx-auto py-8 text-center text-xl text-bazaar-primary min-h-[80vh]">Loading orders...</div>;
  if (error) return <div className="max-w-4xl mx-auto py-8 text-center text-xl text-red-500 min-h-[80vh]">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto min-h-[80vh]">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-2">Your Orders History</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-10 text-gray-500">You have not placed any orders yet.</div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white shadow-lg rounded-xl p-6 border-l-4 border-bazaar-primary">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Order ID: <span className="text-sm font-normal text-gray-500">{order._id.slice(-8)}</span></h2>
                <p className="text-lg font-extrabold text-bazaar-primary">${order.totalAmount.toFixed(2)}</p>
              </div>
              
              <div className="flex justify-between items-center text-sm pt-3">
                <p className="text-gray-600">Order Date: <span className="font-medium">{formatDate(order.orderDate)}</span></p>
                <p className="text-gray-600">Items: <span className="font-medium">{order.items.length}</span></p>
              </div>
              
              {/* Optional: Detailed items list (can be expanded in production) */}
              <div className="mt-4 border-t pt-3">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">Items Purchased:</h3>
                <ul className="list-disc ml-5 space-y-1 text-sm text-gray-600">
                  {order.items.slice(0, 3).map((item, index) => (
                    <li key={index}>
                      {item.productName || 'Product Title'} (x{item.quantity}) - ${item.priceAtPurchase.toFixed(2)}
                    </li>
                  ))}
                  {order.items.length > 3 && <li>... and {order.items.length - 3} more items</li>}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;