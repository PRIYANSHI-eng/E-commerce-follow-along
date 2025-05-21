const express = require("express");
const mongoose = require("mongoose");
const Product = require("../model/product");
const User = require("../model/user");
const router = express.Router();
const { pupload } = require("../multer");
const path = require('path');
const fs = require('fs');
const { isAuthenticatedUser } = require('../middleware/auth');

const validateProductData = (data) => {
  const errors = [];
  if (!data.name) errors.push("Product name is required");
  if (!data.description) errors.push("Product description is required");
  if (!data.category) errors.push("Product category is required");
  if (!data.price || isNaN(data.price) || data.price <= 0)
    errors.push("Valid product price is required");
  if (!data.stock || isNaN(data.stock) || data.stock < 0)
    errors.push("Valid product stock is required");
  if (!data.email) errors.push("Email is required");
  return errors;
};
router.post(
  "/create-product", isAuthenticatedUser, 
  (req, res, next) => {
    console.log("🛒 Starting product creation process");
    console.log("Authenticated user:", req.user);
    
    // Check if products directory exists
    const productsDir = path.join(__dirname, "../products");
    if (!fs.existsSync(productsDir)) {
      console.log("Creating products directory:", productsDir);
      try {
        fs.mkdirSync(productsDir, { recursive: true });
        console.log("Products directory created successfully");
      } catch (err) {
        console.error("Error creating products directory:", err);
        return res.status(500).json({ error: "Failed to create upload directory" });
      }
    }
    
    next();
  },
  pupload.array("images", 10),
  async (req, res) => {
    console.log("🛒 Processing product creation");
    console.log("Request body:", req.body);
    console.log("Files received:", req.files ? req.files.length : 0);
    
    try {
      const { name, description, category, tags, price, stock, email } = req.body;
      
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No images uploaded. At least one image is required." });
      }
      
      // Map uploaded files to accessible URLs
      const images = req.files.map((file) => {
        console.log("Processing file:", file.originalname, "->", file.path);
        return `/products/${path.basename(file.path)}`;
      });
      
      // Validate input data
      const validationErrors = validateProductData({
        name,
        description,
        category,
        price,
        stock,
        email,
      });
      
      if (validationErrors.length > 0) {
        console.log("Validation errors:", validationErrors);
        return res.status(400).json({ errors: validationErrors });
      }
      
      // Find user by email
      console.log("Looking for user with email:", email);
      const user = await User.findOne({ email });
      if (!user) {
        console.log("User not found with email:", email);
        return res.status(400).json({ error: "Email does not exist in the users database" });
      }
      console.log("User found:", user._id);
      
      // Create new product
      const newProduct = new Product({
        name,
        description,
        category,
        tags,
        price,
        stock,
        email,
        images,
      });
      
      console.log("Saving product to database");
      await newProduct.save();
      console.log("Product saved successfully with ID:", newProduct._id);
      
      res.status(201).json({
        message: "Product created successfully",
        product: newProduct,
      });
    } catch (err) {
      console.error("Error creating product:", err);
      res.status(500).json({ 
        error: "Server error. Could not create product.",
        details: err.message 
      });
    }
  }
);

// Test route for file uploads
router.post("/test-upload", pupload.single("testImage"), (req, res) => {
  console.log("Testing file upload");
  
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  
  console.log("File uploaded:", req.file);
  return res.status(200).json({ 
    message: "File uploaded successfully",
    file: req.file
  });
});

// Route: Get all products
router.get("/get-products", async (req, res) => {
  try {
    const products = await Product.find();
    const productsWithFullImageUrl = products.map((product) => {
      if (product.images && product.images.length > 0) {
        product.images = product.images.map((imagePath) => {
          // Image URLs are already prefixed with /products
          return imagePath;
        });
      }
      return product;
    });
    res.status(200).json({ products: productsWithFullImageUrl });
  } catch (err) {
    console.error(" Server error:", err);
    res.status(500).json({ error: "Server error. Could not fetch products." });
  }
});

router.get('/my-products',  isAuthenticatedUser, async (req, res) => {
  const { email } = req.query;
  try {
      const products = await Product.find({ email });
      console.log("Product: ", products);
      const productsWithFullImageUrl = products.map(product => {
          if (product.images && product.images.length > 0) {
              product.images = product.images.map(imagePath => {
                  return imagePath;
              });
          }
          return product;
      });
      res.status(200).json({ products: productsWithFullImageUrl });
  } catch (err) {
      console.error(' Server error:', err);
      res.status(500).json({ error: 'Server error. Could not fetch products.' });
  }
}
);

router.get('/product/:id', isAuthenticatedUser, async (req, res) => {
  console.log("Fetching products...");
  const { id } = req.params;
  try {
      const product = await Product.findById(id);
      console.log("Product: ", product);
      if (!product) {
          return res.status(404).json({ error: 'Product not found.' });
      }
      res.status(200).json({ product });
  } catch (err) {
      console.error('Server error:', err);
      res.status(500).json({ error: 'Server error. Could not fetch product.' });
  }
});

router.put('/update-product/:id', isAuthenticatedUser, pupload.array('images', 10), async (req, res) => {
  const { id } = req.params;
  const { name, description, category, tags, price, stock, email } = req.body;
  try {
      const existingProduct = await Product.findById(id);
      if (!existingProduct) {
          return res.status(404).json({ error: 'Product not found.' });
      }
      let updatedImages = existingProduct.images;
      if (req.files && req.files.length > 0) {
          updatedImages = req.files.map((file) => {
              return `/products/${path.basename(file.path)}`;
          });
      }
      const validationErrors = validateProductData({
          name,
          description,
          category,
          price,
          stock,
          email,
      });
      if (validationErrors.length > 0) {
          return res.status(400).json({ errors: validationErrors });
      }
      existingProduct.name = name;
      existingProduct.description = description;
      existingProduct.category = category;
      existingProduct.tags = tags;
      existingProduct.price = price;
      existingProduct.stock = stock;
      existingProduct.email = email;
      existingProduct.images = updatedImages;
      await existingProduct.save();
      res.status(200).json({
          message: '✅ Product updated successfully',
          product: existingProduct,
      });
  } catch (err) {
      console.error('Server error:', err);
      res.status(500).json({ error: 'Server error. Could not update product.' });
  }
});

router.delete('/delete-product/:id', isAuthenticatedUser, async (req, res) => {
  const { id } = req.params;
  try {
      const existingProduct = await Product.findById(id);
      if (!existingProduct) {
          return res.status(404).json({ error: 'Product not found.' });
      }
      await existingProduct.deleteOne();
      res.status(200).json({ message: '✅ Product deleted successfully' });
  } catch (err) {
      console.error('Server error:', err);
      res.status(500).json({ error: 'Server error. Could not delete product.' });
  }
});

router.post('/cart', isAuthenticatedUser, async (req, res) => {
  try {
      const { userId, productId, quantity } = req.body;
      const email = userId;
      if (!email) {
          return res.status(400).json({ message: 'Email is required' });
      }
      if (!mongoose.Types.ObjectId.isValid(productId)) {
          return res.status(400).json({ message: 'Invalid productId' });
      }
      if (!quantity || quantity < 1) {
          return res.status(400).json({ message: 'Quantity must be at least 1' });
      }
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      const product = await Product.findById(productId);
      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }
      const cartItemIndex = user.cart.findIndex(
          (item) => item.productId.toString() === productId
      );
      if (cartItemIndex > -1) {
          user.cart[cartItemIndex].quantity += quantity;
      } else {
          user.cart.push({ productId, quantity });
      }
      await user.save();
      res.status(200).json({
          message: 'Cart updated successfully',
          cart: user.cart,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
  }
});

// GET cart details endpoint
router.get('/cartproducts', isAuthenticatedUser, async (req, res) => {
  try {
      const { email } = req.query;
      if (!email) {
          return res.status(400).json({ error: 'Email query parameter is required' });
      }
      
      // Populate cart items with product details
      const user = await User.findOne({ email }).populate({
          path: 'cart.productId',
          model: 'Product'
      });
      
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }
      
      // Filter out cart items where the product no longer exists
      // (productId will be null after populate if the product was deleted)
      const validCartItems = user.cart.filter(item => item.productId != null);
      
      // If some items were filtered out, update the user's cart
      if (validCartItems.length !== user.cart.length) {
          console.log(`Removing ${user.cart.length - validCartItems.length} invalid products from cart`);
          user.cart = validCartItems;
          await user.save();
      }
      
      res.status(200).json({
          message: 'Cart retrieved successfully',
          cart: validCartItems
      });
  } catch (err) {
      console.error('Server error:', err);
      res.status(500).json({ error: 'Server Error' });
  }
});

router.put('/cartproduct/quantity', isAuthenticatedUser, async (req, res) => {
  const { email, productId, quantity } = req.body;
  console.log("Updating cart product quantity");
  if (!email || !productId || quantity === undefined) {
      return res.status(400).json({ error: 'Email, productId, and quantity are required' });
  }
  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }
      const cartProduct = user.cart.find(item => item.productId.toString() === productId);
      if (!cartProduct) {
          return res.status(404).json({ error: 'Product not found in cart' });
      }
      cartProduct.quantity = quantity;
      await user.save();
      res.status(200).json({
          message: 'Cart product quantity updated successfully',
          cart: user.cart
      });
  } catch (err) {
      console.error('Server error:', err);
      res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;