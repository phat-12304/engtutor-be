const express = require("express");
const multer = require("multer");
const path = require("path");
const protect = require("../middleware/authMiddlewareJwt");
const Services = require("../services/services");
const UploadFile = require("../services/upload");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "..", "assets", "images", "users");
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const hash = Services.gen_auth_token(file.filename);
    const filename = UploadFile.generateFilename(hash);
    cb(null, filename);
  },
});

const upload = multer({ storage: storage }).single("image");

const router = express.Router();

module.exports = router;
