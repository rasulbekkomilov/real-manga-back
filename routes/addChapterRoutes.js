// routes/addChapterRoutes.js
const express = require("express");
const multer = require("multer");
const { supabase, imagekit } = require("../supabaseClient");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/add-chapter
router.post("/add-chapter", upload.array("images"), async (req, res) => {
   try {
      const { manga_id, chapter_title, chapter_slug, chapter_number } = req.body;
      const files = req.files;

      if (!manga_id || !chapter_title || !chapter_slug || !chapter_number || !files?.length) {
         return res.status(400).json({ error: "⚠️ Barcha maydonlar to‘ldirilishi kerak." });
      }

      // 1. Yangi bob qo‘shish
      const { data: newChapter, error: insertError } = await supabase
         .from("chapter")
         .insert([
            {
               manga_id,
               title: chapter_title,
               slug: chapter_slug,
               chapter_number: parseInt(chapter_number),
            },
         ])
         .select()
         .single();

      if (insertError) throw insertError;

      // 2. Sahifalarni yuklash va bazaga yozish
      const pageInsertData = [];

      for (let i = 0; i < files.length; i++) {
         const uploaded = await imagekit.upload({
            file: files[i].buffer,
            fileName: files[i].originalname,
         });

         pageInsertData.push({
            chapter_id: newChapter.id,
            page_number: i + 1,
            image_url: uploaded.url,
         });
      }

      const { error: pagesInsertError } = await supabase
         .from("chapter_pages")
         .insert(pageInsertData);

      if (pagesInsertError) throw pagesInsertError;

      res.status(201).json({ message: "✅ Bob muvaffaqiyatli qo‘shildi!" });
   } catch (err) {
      console.error("❌ Xatolik:", err.message);
      res.status(500).json({ error: "Serverda xatolik yuz berdi." });
   }
});

module.exports = router;
