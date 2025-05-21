const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define directories
const uploadsDir = path.join(__dirname, "uploads");
const productsDir = path.join(__dirname, "products");

// Create directories if they don't exist
[uploadsDir, productsDir].forEach((dir) => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    }
  } catch (err) {
    console.error(`❌ Error creating directory ${dir}:`, err);
  }
});

// File filter to validate image types
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    console.log("File rejected:", file.originalname);
    return cb(new Error("Only image files are allowed!"), false);
  }
  console.log("File accepted:", file.originalname);
  cb(null, true);
};

// Multer storage configuration for general uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure directory exists before saving
    if (!fs.existsSync(uploadsDir)) {
      try {
        fs.mkdirSync(uploadsDir, { recursive: true });
        console.log(`Created directory on-the-fly: ${uploadsDir}`);
      } catch (err) {
        return cb(new Error(`Could not create upload directory: ${err.message}`));
      }
    }
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filename = path.basename(file.originalname, ext);
    cb(null, `${filename}-${uniqueSuffix}${ext}`);
  },
});

// Multer storage configuration for product images
const pstorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure directory exists before saving
    if (!fs.existsSync(productsDir)) {
      try {
        fs.mkdirSync(productsDir, { recursive: true });
        console.log(`Created directory on-the-fly: ${productsDir}`);
      } catch (err) {
        return cb(new Error(`Could not create products directory: ${err.message}`));
      }
    }
    cb(null, productsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filename = path.basename(file.originalname, ext);
    cb(null, `${filename}-${uniqueSuffix}${ext}`);
  },
});

// Initialize upload objects with limits and validation
exports.upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

exports.pupload = multer({ 
  storage: pstorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});
