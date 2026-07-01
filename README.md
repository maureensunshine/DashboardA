# Mo's Dash

A single-page dashboard: clock (MST/EST/PST/UTC), weather, calendar, calculator, stocks.

## Deploy (same flow as the macros app)

1. Push this folder to a new GitHub repo (or a folder in an existing one).
2. Import it in Vercel.
3. In Vercel project settings -> Environment Variables, add:
   - `ALPHA_VANTAGE_KEY` = `IC4DCSZGO9K56LGR`
4. Deploy. You'll get a URL like `mo-dash.vercel.app`.
5. On your Android phone, open that URL in Chrome -> menu -> "Add to Home screen."

Once it's served over https instead of opened as a local file, geolocation and the
weather/stock fetches will work normally (this was blocked when opened directly
from a downloaded file).

## Why the API key isn't in the code anymore

`api/quote.js` is a Vercel serverless function. The browser calls `/api/quote?symbol=AAPL`,
and that function holds the real Alpha Vantage key server-side and proxies the request.
This also sidesteps Alpha Vantage's inconsistent CORS support for direct browser calls.

## Notes

- Calendar events and your stock ticker list save to the phone's local storage,
  so they're per-device (won't sync across phones/browsers).
- Alpha Vantage free tier = 25 lookups/day. Quotes cache for 15 minutes per
  symbol to stay well under that. Use "Force refresh" in the Stocks card if needed.
