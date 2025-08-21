const express = require("express");
const multer = require("multer");
const path = require("path");
const protect = require("../middleware/authMiddlewareJwt");
const Services = require("../services/services");
const UploadFile = require("../services/upload");
const UserController = require("../controllers/UserController");
const TutorController = require("../controllers/TutorController");

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

/* USER */
router.get("/users", UserController.getAll);
router.get("/me", protect, UserController.me);
router.post("/register", UserController.store);
router.post("/login", UserController.login);
router.put("/users", protect, UserController.update);

/* TUTOR */
router.get("/tutors", TutorController.getAll);
router.post("/tutors", TutorController.store);
router.put("/tutors/:id", TutorController.update);

module.exports = router;
