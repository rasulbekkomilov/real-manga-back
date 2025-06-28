const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient'); // ✅ Supabase client

router.post('/add-chapter', async (req, res) => {
   try {
      const {
         manga_id,
         chapter_title,
         chapter_slug,
         chapter_number,   // ✅ chapter number ham kiritiladi
         image_urls
      } = req.body;

      console.log("✅ Kiruvchi ma'lumotlar:", req.body);

      if (!manga_id || !chapter_title || !chapter_slug || chapter_number === undefined || !image_urls || image_urls.length === 0) {
         console.warn("⚠️ Ma'lumotlar yetarli emas");
         return res.status(400).json({ error: 'Maʼlumotlar yetarli emas' });
      }

      // 1. Chapterni saqlash
      const { data: chapter, error: chapterError } = await supabase
         .from('chapter')
         .insert([{
            manga_id,
            title: chapter_title,
            slug: chapter_slug,
            number: chapter_number // ✅ yangi ustun
         }])
         .select()
         .single();

      if (chapterError) {
         console.error("❌ Chapter saqlashda xato:", chapterError.message);
         return res.status(500).json({ error: chapterError.message });
      }
      const pageInserts = image_urls.map((url, i) => ({
         chapter_id: chapter.id,
         page_number: i + 1,
         image_url: url,
      }));

      await supabase.from("chapter_pages").insert(pageInserts);
      // 2. Sahifa rasmlarini saqlash
      const pages = image_urls.map((url, index) => ({
         chapter_id: chapter.id,
         page_number: index + 1,
         image_url: url,
      }));

      const { error: pageError } = await supabase
         .from('chapter_pages')
         .insert(pages);

      if (pageError) {
         console.error("❌ Sahifalarni saqlashda xato:", pageError.message);
         return res.status(500).json({ error: pageError.message });
      }

      console.log("✅ Chapter va sahifalar muvaffaqiyatli qo‘shildi.");
      return res.status(200).json({ message: '✅ Bob va sahifalar muvaffaqiyatli qo‘shildi', chapter });

   } catch (err) {
      console.error("❌ Server xatosi:", err.message);
      return res.status(500).json({ error: '❌ Server ichki xatosi' });
   }
});

module.exports = router;
