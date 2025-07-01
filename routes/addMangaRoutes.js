// routes/addMangaRoutes.js
const express = require("express");
const router = express.Router();
const { supabase } = require("../supabaseClient");

// @route POST /api/add-manga
router.post("/api/add-manga", async (req, res) => {
   try {
      const { title, slug, description, status, cover_url, genres } = req.body;

      if (!title || !slug || !description || !status || !cover_url) {
         return res.status(400).json({ error: "⚠️ Barcha maydonlar to‘ldirilishi kerak." });
      }

      const { data, error } = await supabase.from("manga").insert([
         { title, slug, description, status, cover_url, genres }
      ]);

      if (error) {
         console.error("❌ Supabase xato:", error.message);
         return res.status(500).json({ error: error.message });
      }

      res.status(200).json({ message: "✅ Manga muvaffaqiyatli qo‘shildi.", data });
   } catch (err) {
      console.error("❌ Server xato:", err);
      res.status(500).json({ error: "Server xatosi yuz berdi." });
   }
});

module.exports = router;
