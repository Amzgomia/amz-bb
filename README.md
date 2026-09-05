# AMZ BB — Professional Functional Starter

AMZ BB is a local-first BigBasket shopping assistant panel with:

- BigBasket product search through QuickCommerce API
- Product image, price, MRP, stock, rating/deeplink when returned
- Cart and coupon engine
- SQLite wallet ledger
- Razorpay wallet top-up with signature verification
- Order history and wallet deduction
- Bulk-order request queue
- Admin dashboard
- Telegram bot menu and Web App button
- Support link

## Important integration boundary

This project does **not** automate BigBasket private login, OTP/CAPTCHA, hidden APIs, account/session extraction, or direct order/payment placement. QuickCommerce API's documented BigBasket integration is used for product data and returned deeplinks; the user completes checkout on BigBasket. Direct order creation requires an authorized BigBasket ordering integration if one is available to you.

## Run on Windows

1. Open this folder in CMD.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Fill your own QuickCommerce and Razorpay credentials.
5. Run `npm start` for the web panel.
6. Run `npm run bot` for the Telegram bot.
7. Open `http://localhost:3000`.
8. Admin panel: `http://localhost:3000/admin.html`.

`start-windows.bat` can launch the server, bot, and browser together after dependencies are installed.

## Telegram Web App

For Telegram to open the web panel on a phone, `APP_URL` must be a publicly reachable **HTTPS** URL. `localhost` works only on your PC. Set the BotFather Web App/menu URL to that HTTPS URL after deployment.

## Environment variables

See `.env.example`. Never paste API keys, Razorpay secret, or bot token into chat or frontend code.

## Admin

Set `ADMIN_PASSWORD` in `.env` and use it at `/admin.html`. For production deployment, replace this simple header password with a proper authenticated admin session.
