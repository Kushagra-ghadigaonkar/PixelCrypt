const express = require("express");
const multer = require("multer");
const encrypt = require("./encrypt");
const decrypt = require("./decrypt");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// 🔐 Encrypt Route
router.post("/api/encrypt", upload.single("image"), async (req, res) => {
  try {
    const fileId = Date.now(); // Unique file ID
    const inputBuffer = req.file.buffer;

    const { encryptedImageUrl, keyFileUrl } = await encrypt(inputBuffer, fileId);

    res.json({
      message: "Encryption successful",
      encryptedImageUrl,
      keyFileUrl,
    });
  } catch (err) {
    console.error("Encryption error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🔓 Decrypt Route
router.post(
  "/api/decrypt",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "key", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const imageBuffer = req.files.image[0].buffer;
      const keyBuffer = req.files.key[0].buffer;

      const decryptedImageBuffer = await decrypt(imageBuffer, keyBuffer);

      res.set("Content-Type", "image/png");
      res.send(decryptedImageBuffer);
    } catch (err) {
      console.error("Decryption error:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
