// routes/uploadRoutes.js
const express = require("express");
const multer = require("multer");
const { imagekit } = require("../supabaseClient");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", upload.single("file"), async (req, res) => {
   try {
      const file = req.file;
      if (!file) return res.status(400).json({ error: "Rasm fayli yo‘q." });

      const uploaded = await imagekit.upload({
         file: file.buffer,
         fileName: file.originalname,
      });

      res.status(200).json({ url: uploaded.url });
   } catch (err) {
      console.error("❌ Yuklashda xato:", err.message);
      res.status(500).json({ error: "Yuklashda xatolik yuz berdi." });
   }
});

module.exports = router;
