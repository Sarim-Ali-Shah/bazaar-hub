const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// @route   GET /api/products
// @desc    Get all products (with search/filter)
// Frontend requirement: GET /products
router.get('/', async (req, res) => {
 try {
    // Attempt a basic, un-filtered find operation
    // We remove the .populate for debugging, though it should work.
    const products = await Product.find({}); 
    
    // Log the success and send the data
    console.log(`Successfully fetched ${products.length} products.`);
    res.json(products);
    
  } catch (error) {
    // Log the FULL error for diagnosis
    console.error('CRITICAL ERROR in GET /api/products:', error.message);
    res.status(500).json({ message: 'Failed to fetch products. Check backend console.' });
  }
});
 

// @route   GET /api/products/my-products
// @desc    Get all products by the logged-in seller
// Frontend requirement for My Products Page
router.get('/my-products', protect, restrictTo('seller'), async (req, res) => {
  try {
    // req.user is set by the protect middleware (it holds the user ID)
    const products = await Product.find({ seller: req.user }).populate('seller', 'name');
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch your products.' });
  }
});

// @route   GET /api/products/:id
// @desc    Get a single product by ID
// Frontend requirement: GET /products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name email');

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch product details.' });
  }
});

// @route   POST /api/products
// @desc    Create a new product (Seller only)
// Frontend requirement: POST /products
router.post('/', protect, restrictTo('seller'), async (req, res) => {
  try {
    const { title, description, price, category, image } = req.body;
    
    // Create new product linked to the authenticated seller
    const product = new Product({
      title,
      description,
      price,
      category,
      image,
      seller: req.user, // ID from protect middleware
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid product data provided.' });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product (Only by the seller who created it)
// Frontend requirement: PUT /products/:id
router.put('/:id', protect, restrictTo('seller'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // Check if the product belongs to the logged-in user
      if (product.seller.toString() !== req.user.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this product.' });
      }

      // Update fields
      product.title = req.body.title || product.title;
      product.description = req.body.description || product.description;
      product.price = req.body.price || product.price;
      product.category = req.body.category || product.category;
      product.image = req.body.image || product.image;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update product.' });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product (Only by the seller who created it)
// Frontend requirement: DELETE /products/:id
router.delete('/:id', protect, restrictTo('seller'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // Check if the product belongs to the logged-in user
      if (product.seller.toString() !== req.user.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this product.' });
      }

      await Product.deleteOne({ _id: req.params.id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete product.' });
  }
});

module.exports = router; 