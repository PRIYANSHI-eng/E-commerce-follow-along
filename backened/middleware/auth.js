const jwt = require('jsonwebtoken');
  const User = require('../model/user');
  const ErrorHandler = require('../utils/ErrorHandler');
  const catchAsyncErrors = require('./catchAsyncErrors');
  
  const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
      console.log("Checking authentication...");
      console.log("Cookies:", req.cookies);
      
      const token = req.cookies.token;
      console.log("Token from cookies:", token);
      
      // Also check for token in Authorization header
      const authHeader = req.headers.authorization;
      console.log("Authorization header:", authHeader);
      
      // Use token from cookie or Authorization header
      const finalToken = token || (authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null);
      
      if (!finalToken) {
          console.log("No token found in cookies or Authorization header");
          return next(new ErrorHandler("Please login to access this resource", 401));
      }
      
      console.log("Using token:", finalToken.substring(0, 10) + "...");
      
      let decodedData;
      try {
          // Verify token using your JWT secret
          decodedData = jwt.verify(finalToken, process.env.JWT_SECRET || "randomtoken1234567890");
          console.log("Decoded data:", decodedData);
      } catch (err) {
          // If this block executes, jwt.verify() threw an error
          console.error("JWT verification error:", err.name, err.message);
          return next(new ErrorHandler("Invalid or expired token", 401));
      }

      // Now attach user details to request
      req.user = await User.findById(decodedData.id);
      if (!req.user) {
          console.log("User not found with ID:", decodedData.id);
          return next(new ErrorHandler("User not found", 404));
      }
      
      console.log("Authentication successful for user:", req.user.email);
      next();
  });
  
  module.exports = { isAuthenticatedUser };