const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// @route   POST /api/orders
// @desc    Create a new order (Buyer only)
// Frontend requirement: POST /orders
router.post('/', protect, restrictTo('buyer'), async (req, res) => {
  const { items, totalAmount, shippingAddress, paymentMethod } = req.body;

  if (!items || items.length === 0 || !totalAmount || !shippingAddress) {
    return res.status(400).json({ message: 'Order data is missing or incomplete.' });
  }

  try {
    // 1. Fetch product names and verify existence for each item
    const itemIds = items.map(item => item.product);
    const products = await Product.find({ '_id': { $in: itemIds } }).select('title');
    const productMap = products.reduce((map, p) => {
      map[p._id.toString()] = p.title;
      return map;
    }, {});
    
    // 2. Map and enrich order items
    const orderItems = items.map(item => ({
      ...item,
      productName: productMap[item.product],
    }));

    const order = new Order({
      buyer: req.user, // ID from protect middleware
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
    });

    const createdOrder = await order.save();
    // Use createdOrder._id.slice(-8) for the alert in the frontend
    res.status(201).json({ 
        message: 'Order placed successfully!', 
        orderId: createdOrder._id.toString() 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create order.' });
  }
});

// @route   GET /api/orders
// @desc    Get all orders for the logged-in buyer
// Frontend requirement: GET /orders
router.get('/', protect, restrictTo('buyer'), async (req, res) => {
  try {
    // Fetch orders only for the authenticated buyer (req.user)
    const orders = await Order.find({ buyer: req.user }).select('-items.product'); // Don't send product ID
    
    // Send basic order info: _id, totalAmount, orderDate, item count
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch orders.' });
  }
});

module.exports = router; 