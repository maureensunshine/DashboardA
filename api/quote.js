const https = require('https');

module.exports = async function handler(req, res) {
  const { symbol } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: 'Missing symbol' });
  }

  const apiKey = process.env.ALPHA_VANTAGE_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing ALPHA_VANTAGE_KEY' });
  }

  const endpoint = new URL('https://www.alphavantage.co/query');
  endpoint.searchParams.set('function', 'GLOBAL_QUOTE');
  endpoint.searchParams.set('symbol', symbol);
  endpoint.searchParams.set('apikey', apiKey);

  try {
    const data = await new Promise((resolve, reject) => {
      https.get(endpoint, (response) => {
        let body = '';
        response.on('data', chunk => body += chunk);
        response.on('end', () => {
          try { resolve(JSON.parse(body)); }
          catch (e) { reject(new Error('Bad JSON: ' + body.slice(0, 100))); }
        });
      }).on('error', reject);
    });

    const q = data['Global Quote'];

    if (!q || !q['05. price']) {
      return res.status(200).json({ error: 'No data', raw: data });
    }

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json({
      symbol:        q['01. symbol'],
      price:         parseFloat(q['05. price']).toFixed(2),
      change:        q['09. change'],
      changePercent: q['10. change percent'],
    });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
};
