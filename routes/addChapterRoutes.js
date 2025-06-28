// routes/addChapterRoutes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const { supabase } = require("../supabaseClient");
const ImageKit = require("imagekit");

const imagekit = new ImageKit({
   publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
   privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
   urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

router.post("/", upload.array("images"), async (req, res) => {
   try {
      const { manga_id, chapter_title, chapter_slug, chapter_number } = req.body;
      const images = req.files;

      if (!manga_id || !chapter_title || !chapter_slug || !chapter_number || images.length === 0) {
         return res.status(400).json({ message: "All fields are required." });
      }

      // 1. Save chapter to DB
      const { data: chapterData, error: chapterError } = await supabase
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

      if (chapterError) throw chapterError;

      // 2. Upload each image to ImageKit and insert page data
      for (let i = 0; i < images.length; i++) {
         const image = images[i];
         const uploaded = await imagekit.upload({
            file: image.buffer,
            fileName: `chapter_${chapter_slug}_page_${i + 1}.jpg`,
         });

         await supabase.from("chapter_pages").insert({
            chapter_id: chapterData.id,
            page_number: i + 1,
            image_url: uploaded.url,
         });
      }

      res.status(200).json({ message: "Chapter added successfully." });
   } catch (error) {
      console.error("❌ Server Error:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
   }
});

module.exports = router;
