const express = require("express");
const router = express.Router();
const { supabase } = require("../supabaseClient");

// GET /api/manga – barcha mangalarni olish
router.get("/manga", async (req, res) => {
   const { data, error } = await supabase.from("manga").select("*");
   if (error) return res.status(500).json({ error: error.message });
   res.json(data);
});


module.exports = router;
