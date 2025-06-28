const express = require("express");
const cors = require("cors");
const multer = require("multer");
const dotenv = require("dotenv");
const path = require("path");

// .env faylni yuklash
dotenv.config();

const app = express();
const upload = multer(); // multipart/form-data uchun kerak

// Ortiqcha ma'lumotlarni to‘g‘ri qabul qilish uchun
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Supabase va ImageKit ulanishlari
const { supabase } = require("./supabaseClient");
const ImageKit = require("imagekit");

const imagekit = new ImageKit({
   publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
   privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
   urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// ✅ Test route
app.get("/", (req, res) => {
   res.send("✅ Real Manga Backend ishlayapti!");
});

// ✅ API: Yangi bob qo‘shish (upload bilan birga)
app.post("/api/add-chapter", upload.array("images"), async (req, res) => {
   try {
      const { manga_id, chapter_title, chapter_slug, chapter_number } = req.body;
      const images = req.files;

      if (!manga_id || !chapter_title || !chapter_slug || !chapter_number || !images.length) {
         return res.status(400).json({ message: "❌ Barcha maydonlar to‘ldirilmagan!" });
      }

      // 1. Yangi bob qo‘shish
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

      // 2. Har bir rasmni yuklab, sahifa sifatida kiritish
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

      res.status(200).json({ message: "✅ Bob muvaffaqiyatli qo‘shildi!" });
   } catch (error) {
      console.error("❌ Server xatoligi:", error.message);
      res.status(500).json({ message: "❌ Serverda xatolik yuz berdi." });
   }
});

// ✅ Port sozlamasi
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
   console.log(`🚀 Server ${PORT}-portda ishlamoqda...`);
});
