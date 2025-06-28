const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json({ limit: '20mb' }));

// Routes
const chapterRoutes = require('./routes/chapterRoutes');
const mangaRoutes = require('./routes/mangaRoutes');

app.use('/api', chapterRoutes);
app.use('/api', mangaRoutes);

// Test route
app.get('/', (req, res) => {
   res.send('✅ Real Manga backend ishlayapti');
});

// Serverni ishga tushirish
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server ishga tushdi: http://localhost:${PORT}`));

const uploadRoutes = require("./routes/uploadRoutes");
app.use("/api", uploadRoutes);
