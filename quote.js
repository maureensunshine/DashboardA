export default async function handler(req, res) {
  const { symbol } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: 'Missing symbol' });
  }

  const apiKey = process.env.ALPHA_VANTAGE_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Server missing ALPHA_VANTAGE_KEY env var' });
  }

  try {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    const q = data['Global Quote'];

    if (!q || !q['05. price']) {
      return res.status(200).json({ error: 'No data for symbol', raw: data });
    }

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json({
      symbol: q['01. symbol'],
      price: parseFloat(q['05. price']).toFixed(2),
      change: q['09. change'],
      changePercent: q['10. change percent'],
    });
  } catch (err) {
    return res.status(500).json({ error: 'Upstream fetch failed', detail: String(err) });
  }
}
