const express = require("express");
const multer = require("multer");
const path = require("path");
const encrypt = require("./encrypt");
const decrypt = require("./decrypt");
const fs = require("fs");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// Encrypt Route
router.post("/api/encrypt", upload.single("image"), async (req, res) => {
  try {
    const inputPath = req.file.path;
    const outputPath = `output/encrypted_${req.file.filename}`;
    const keyPath = `keyfiles/key_${req.file.filename}.txt`;

    await encrypt(inputPath, outputPath, keyPath);
    res.download(outputPath); // 🔥 sends encrypted image back
  } catch (err) {
    console.error("Encryption error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Decrypt Route
const decryptUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "key", maxCount: 1 },
]);

router.post("/api/decrypt", decryptUpload, async (req, res) => {
  try {
    const imagePath = req.files.image[0].path;
    const keyPath = req.files.key[0].path;
    const outputPath = `output/decrypted_${Date.now()}.png`;

    await decrypt(imagePath, keyPath, outputPath);
    res.download(outputPath);
  } catch (err) {
    console.error("Decryption error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
