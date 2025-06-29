const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const { imagekit } = require("../supabaseClient");

router.post("/upload", upload.single("file"), async (req, res) => {
   try {
      const file = req.file;
      const uploaded = await imagekit.upload({
         file: file.buffer,
         fileName: file.originalname,
      });
      res.status(200).json(uploaded);
   } catch (err) {
      console.error("❌ Upload xatolik:", err);
      res.status(500).json({ error: "Uploadda xatolik yuz berdi." });
   }
});

module.exports = router;