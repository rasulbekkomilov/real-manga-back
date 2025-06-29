const express = require("express");
const cors = require("cors");
require("dotenv").config();

const addMangaRoutes = require("./routes/addMangaRoutes");
const addChapterRoutes = require("./routes/addChapterRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// 🔧 GET / uchun oddiy javob
app.get("/", (req, res) => {
   res.send("✅ Manga backend server ishlayapti.");
});

// 🔁 API routelar
app.use("/api", addMangaRoutes);
app.use("/api", addChapterRoutes);
app.use("/api", uploadRoutes);

// 🔃 Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
   console.log(`🚀 Server ${PORT}-portda ishga tushdi`);
});
