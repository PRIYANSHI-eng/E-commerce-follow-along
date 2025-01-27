const express = require("express");
const path = require("path");
const User = require("../model/user");
const router = express.Router();
const { upload } = require("../multer");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");

// create user
router.post("/create-user", upload.single("file"), async (req, res) => {
    console.log("create user");
    console.log(req.body);
    const { name, email, password } = req.body;
});
module.exports = router;