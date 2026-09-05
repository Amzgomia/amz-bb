# AMZ BB — Fresh Render Build

This version is deliberately flat so Render runs the correct entry file.

## Files
- `server.js` — web server
- `telegram.js` — Telegram bot
- `db.js` — SQLite database
- `public/` — web panel
- `package.json` — Node 22 + better-sqlite3 12

## Render
Build Command:
`npm install`

Start Command:
`npm start`

Node:
`22.x`

## Environment variables
Set these in Render Environment:
- `APP_URL` = your Render HTTPS URL
- `TELEGRAM_BOT_TOKEN` = your bot token
- `TELEGRAM_BOT_USERNAME` = bbamz_bot
- `SUPPORT_USERNAME` = amzbb_support
- `QUICKCOMMERCE_API_KEY` = your authorized QuickCommerce key
- `RAZORPAY_KEY_ID` = your Razorpay key ID
- `RAZORPAY_KEY_SECRET` = your Razorpay secret
- `ADMIN_PASSWORD` = your admin password
- `SESSION_SECRET` = a long random secret

## Local
`npm install`
`npm start`

Bot:
`npm run bot`

Note: BigBasket checkout/order creation is not automated here. Product data can be obtained through an authorized QuickCommerce integration and purchase can be completed through the official/authorized BigBasket flow.
