const express = require("express");
const app = express();
const ErrorHandler = require('./utils/ErrorHandler');

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({
        path: "backend/config/.env"
    });
}

app.use((err, req, res, next) => {
    if (err instanceof ErrorHandler) {
        // Custom error handling logic for ErrorHandler instance
        return res.status(err.statusCode || 500).json({
            message: err.message,
            stack: err.stack
        });
    }

    // Default error handling if not an instance of ErrorHandler
    res.status(500).json({ message: "Internal Server Error" });
});

module.exports = app;
