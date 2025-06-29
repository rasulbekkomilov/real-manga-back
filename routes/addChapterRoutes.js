const express = require("express");
const router = express.Router();
const { supabase } = require("../supabaseClient");

router.post("/add-chapter", async (req, res) => {
   const { manga_id, chapter_title, chapter_slug, chapter_number, image_urls } = req.body;

   if (!manga_id || !chapter_title || !chapter_slug || !chapter_number || !image_urls?.length) {
      return res.status(400).json({ error: "⚠️ Barcha maydonlar to‘ldirilishi kerak." });
   }

   try {
      // 1. chapter jadvaliga yangi bob qo‘shamiz
      const { data: chapterData, error: chapterError } = await supabase
         .from("chapter")
         .insert([
            {
               manga_id,
               title: chapter_title,
               slug: chapter_slug,
               number: chapter_number,
            },
         ])
         .select()
         .single();

      if (chapterError) {
         console.error("❌ Chapter qo‘shishda xatolik:", chapterError.message);
         return res.status(500).json({ error: chapterError.message });
      }

      const chapter_id = chapterData.id;

      // 2. Har bir rasmni chapter_pages ga joylaymiz
      const pagesToInsert = image_urls.map((url, index) => ({
         chapter_id,
         image_url: url,
         page_number: index + 1,
      }));

      const { error: pagesError } = await supabase
         .from("chapter_pages")
         .insert(pagesToInsert);

      if (pagesError) {
         console.error("❌ Sahifalarni qo‘shishda xato:", pagesError.message);
         return res.status(500).json({ error: pagesError.message });
      }

      res.json({ message: "✅ Bob va sahifalar muvaffaqiyatli qo‘shildi!", chapter_id });
   } catch (err) {
      console.error("❌ Server xatosi:", err.message);
      res.status(500).json({ error: "Serverda ichki xatolik yuz berdi." });
   }
});

module.exports = router;
