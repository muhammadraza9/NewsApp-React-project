export default async function handler(req, res) {
  const { category = "general", page = 1 } = req.query;

  const API_KEY = process.env.GNEWS_API_KEY;

  try {
    const url = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=us&max=5&page=${page}&apikey=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
}