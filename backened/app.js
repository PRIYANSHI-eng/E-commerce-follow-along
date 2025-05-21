const express = require("express");
const app = express(); 
const ErrorHandler = require("./middleware/error");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const product= require('./controller/product')
const path=require('path')
const orders = require('./controller/orders');


app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Allow frontend origins
        credentials: true, // Allow cookies and credentials
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        exposedHeaders: ['Set-Cookie']
    })
);

// Increase payload size limit for file uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use("/", express.static("uploads"));
app.use("/products", express.static("products"));

// Add error handling for file uploads
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large' });
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ error: 'Unexpected file field' });
  }
  next(err);
});


app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// Configuration for environment variables
if (process.env.NODE_ENV !== "PRODUCTION") {
    // Load environment variables from the .env file if the environment is not production
    require("dotenv").config({
        path: "backend/config/.env",
    });
};
// Serve static files for uploads and products
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/products', express.static(path.join(__dirname, 'products')));

// Ensure directories exist
const fs = require('fs');
const uploadDir = path.join(__dirname, 'uploads');
const productsDir = path.join(__dirname, 'products');

[uploadDir, productsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    try {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Directory created: ${dir}`);
    } catch (err) {
      console.error(`Failed to create directory ${dir}:`, err);
    }
  } else {
    console.log(`Directory exists: ${dir}`);
  }
});

//import Routes
const user = require("./controller/user");
// Simple health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

app.use("/api/v2/user", user);
app.use("/api/v2/product", product);
app.use("/api/v2/orders", orders);
app.use(ErrorHandler);
module.exports= app;