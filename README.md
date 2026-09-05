# AMZ BB

Free Render Web Service deployment. Telegram uses Bot API webhooks from the same web service, so a paid Render Background Worker is not required.

Render Build Command: npm install
Render Start Command: npm start
Node: 22.x

Environment variables: APP_URL, TELEGRAM_BOT_TOKEN, TELEGRAM_BOT_USERNAME, SUPPORT_USERNAME, QUICKCOMMERCE_API_KEY, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, ADMIN_PASSWORD, SESSION_SECRET.

The Telegram bot webhook is registered automatically when the web service starts.
BigBasket checkout/order creation is not automated; use authorized product data and the official/authorized BigBasket purchase flow.
