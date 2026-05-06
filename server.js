const express = require('express');
const app = express();

app.get('/api/news', async (req, res) => {
  try {
    const validCategories = ["general", "technology", "business", "entertainment", "health", "science", "sports"];
    const { category = 'general', page = 1 } = req.query;

    const safeCategory = validCategories.includes(category) ? category : "general";
    const safePage = Math.max(1, Math.min(parseInt(page) || 1, 10));

    const API_KEY = process.env.GNEWS_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({ error: "Missing API key" });
    }

    const url = `https://gnews.io/api/v4/top-headlines?category=${safeCategory}&lang=en&country=us&max=10&page=${safePage}&token=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    return res.json({
      articles: data.articles || [],
      total: data.totalArticles || 0
    });

  } catch (error) {
    return res.status(500).json({ error: "Server error", details: error.message });
  }
});

app.listen(5000, () => console.log('✅ API server running on http://localhost:5000'));