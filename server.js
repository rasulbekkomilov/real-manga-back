const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '20mb' }));

// ROUTES
const mangaRoutes = require('./routes/mangaRoutes');
const chapterRoutes = require('./routes/chapterRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const addChapterRoutes = require("./routes/addChapterRoutes");

app.use('/api', mangaRoutes);
app.use('/api', chapterRoutes);
app.use('/api', uploadRoutes);
app.use("/api", addChapterRoutes);

// Test route
app.get('/', (req, res) => {
   res.send('✅ Real Manga backend ishlayapti');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
   console.log(`🚀 Server ishga tushdi: http://localhost:${PORT}`);
});
