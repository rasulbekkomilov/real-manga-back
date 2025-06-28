const express = require("express");
const router = express.Router();
const multer = require("multer");
const ImageKit = require("imagekit");

// 🔐 ImageKit konfiguratsiyasi
const imagekit = new ImageKit({
   publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
   privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
   urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// 📦 Multer orqali fayl olish
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 🔄 Upload endpoint
router.post("/upload", upload.single("file"), async (req, res) => {
   try {
      const file = req.file;

      const result = await imagekit.upload({
         file: file.buffer,
         fileName: file.originalname,
      });

      res.status(200).json({ url: result.url });
   } catch (err) {
      console.error("❌ Upload xatosi:", err.message);
      res.status(500).json({ error: "Rasm yuklashda xato", details: err.message });
   }
});

module.exports = router;
