export default async function handler(req, res) {
  const { lat, lng } = req.query;

  const params = new URLSearchParams({
    key: process.env.HOTPEPPER_API_KEY,
    lat,
    lng,
    range: 3,
    genre: "G013", // ラーメンジャンル
    format: "json",
  });

  const url = `https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?${params}`;

  try {
    const response = await fetch(url);
    const text = await response.text();
    const json = JSON.parse(text);
    res.status(200).json(json);
  } catch (error) {
    res.status(500).json({ error: "HotPepper API failed." });
  }
}
