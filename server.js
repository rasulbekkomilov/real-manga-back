const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

const uploadRoutes = require("./routes/uploadRoutes");
const addChapterRoutes = require("./routes/addChapterRoutes");
const addMangaRoutes = require("./routes/addMangaRoutes"); // ✅ YANGI

app.use(cors());
app.use(express.json());

// Route'lar
app.use("/api/upload", uploadRoutes);
app.use("/api/add-chapter", addChapterRoutes);
app.use("/api/add-manga", addMangaRoutes); // ✅ YANGI


// Server ishga tushishi
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
   console.log(`✅ Server ${PORT} portda ishga tushdi`);
});
