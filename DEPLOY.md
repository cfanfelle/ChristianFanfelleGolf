# Deploy Online

GitHub Pages cannot run `server.js`, so Stripe Checkout will not work there. Deploy this repo as a Node web service.

## Render

1. Go to Render and create a new Blueprint or Web Service from this GitHub repo.
2. Use these settings if creating a Web Service manually:
   - Build command: `npm install`
   - Start command: `npm start`
   - Health check path: `/healthz`
3. Add environment variables in Render:
   - `STRIPE_SECRET_KEY`: your Stripe secret key, `sk_test_...` for testing or `sk_live_...` for live payments
   - `PUBLIC_SITE_URL`: your deployed site URL, for example `https://christian-fanfelle-golf.onrender.com`
   - `DEFAULT_DONATION_AMOUNT`: `10000`
4. Open the deployed Render URL, not the GitHub Pages URL.

For real donations, activate Stripe and use live keys. Keep `.env` local only.
