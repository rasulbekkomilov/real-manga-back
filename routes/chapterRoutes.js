const express = require("express");
const router = express.Router();
const { supabase } = require("../supabaseClient");

router.get("/manga", async (req, res) => {
   const { data, error } = await supabase.from("manga").select("*");
   if (error) {
      console.error("❌ Manga olishda xato:", error.message);
      return res.status(500).json({ error: error.message });
   }
   res.json(data);
});

module.exports = router;
