export default async function handler(req, res) {
  try {
    const { category = "general", page = 1 } = req.query;

    const API_KEY = process.env.GNEWS_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({
        error: "Missing API key"
      });
    }

    const url = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=us&max=10&page=${page}&apikey=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({
        error: "GNews failed",
        details: data
      });
    }

    // ✅ ALWAYS return correct format
    return res.status(200).json({
      articles: data.articles || []
    });

  } catch (error) {
    return res.status(500).json({
      error: "Server error",
      details: error.message
    });
  }
}