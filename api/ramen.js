// api/ramen.js
export default async function handler(req, res) {
  const { lat, lng } = req.query;
  const HOTPEPPER_API_KEY = process.env.HOTPEPPER_API_KEY;

  if (!lat || !lng) {
    return res.status(400).json({ error: '緯度と経度が必要です' });
  }

  const url = `https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=${HOTPEPPER_API_KEY}&lat=${lat}&lng=${lng}&range=3&genre=G013&format=json`;

  try {
    const response = await fetch(url);
    const data = await response.text(); // JSONだがtextでOK
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  } catch (err) {
    res.status(500).json({ error: 'データ取得失敗' });
  }
}
