const express = require("express");
const router = express.Router();
const { supabase } = require("../supabaseClient");

// ✅ Yangi mangani qo‘shish (genres ni text[] sifatida yozish)
router.post("/add-manga", async (req, res) => {
   const { title, slug, description, status, cover_url, genres } = req.body;

   try {
      const { data, error } = await supabase
         .from("manga")
         .insert([{ title, slug, description, status, cover_url, genres }])
         .select()
         .single();

      if (error) {
         return res.status(500).json({ error: "Manga yozishda xatolik", details: error.message });
      }

      return res.status(200).json({ message: "✅ Manga muvaffaqiyatli qo‘shildi", manga: data });
   } catch (err) {
      console.error("❌ Server xatosi:", err);
      return res.status(500).json({ error: "Server xatosi", details: err.message });
   }
});

module.exports = router;
