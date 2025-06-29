const express = require("express");
const router = express.Router();
const { supabase } = require("../supabaseClient");

router.post("/add-chapter", async (req, res) => {
   try {
      const { manga_id, chapter_title, chapter_slug, chapter_number, image_urls } = req.body;

      if (!manga_id || !chapter_title || !chapter_slug || !chapter_number || !image_urls?.length) {
         return res.status(400).json({ error: "⚠️ Barcha maydonlar to‘ldirilishi shart." });
      }

      const { data: chapter, error: chapterError } = await supabase
         .from("chapter")
         .insert({
            manga_id,
            title: chapter_title,
            slug: chapter_slug,
            chapter_number,
         })
         .select()
         .single();

      if (chapterError) throw chapterError;

      const pages = image_urls.map((url, index) => ({
         chapter_id: chapter.id,
         page_number: index + 1,
         image_url: url,
      }));

      const { error: pagesError } = await supabase.from("chapter_pages").insert(pages);
      if (pagesError) throw pagesError;

      res.status(200).json({ message: "✅ Bob va sahifalar qo‘shildi." });
   } catch (error) {
      console.error("❌ Backend xatolik:", error.message || error);
      res.status(500).json({ error: "❌ Serverda xatolik yuz berdi." });
   }
});

module.exports = router;
