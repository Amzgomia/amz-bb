require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.log('Telegram bot disabled: TELEGRAM_BOT_TOKEN is not configured.');
  process.exit(0);
}
const bot = new TelegramBot(token, { polling: true });
const username = String(process.env.TELEGRAM_BOT_USERNAME || 'bbamz_bot').replace(/^@/, '');
const support = String(process.env.SUPPORT_USERNAME || 'amzbb_support').replace(/^@/, '');
const appUrl = process.env.APP_URL || 'https://example.com';

function keyboard() {
  const rows = [
    [{ text: '🛒 Open AMZ BB', web_app: { url: appUrl } }],
    [{ text: '💰 Wallet', callback_data: 'wallet' }, { text: '📜 Orders', callback_data: 'orders' }],
    [{ text: '📦 Bulk Order', callback_data: 'bulk' }, { text: '🆘 Support', callback_data: 'support' }]
  ];
  return { inline_keyboard: rows };
}

bot.onText(/^\/(start|menu)(?:@\w+)?$/i, async msg => {
  const text = `🛒 *Welcome to AMZ BB!*\n\n⚡ Fast • Easy • Secure\n\nUse the button below to open the shopping panel.\n\n💰 Wallet: ₹0.00\n📦 Orders: Manage from the panel.`;
  await bot.sendMessage(msg.chat.id, text, { parse_mode: 'Markdown', reply_markup: keyboard() });
});

bot.on('callback_query', async q => {
  const id = q.message.chat.id;
  if (q.data === 'support') await bot.sendMessage(id, `🆘 Support: https://t.me/${support}`);
  else if (q.data === 'wallet') await bot.sendMessage(id, '💳 Open AMZ BB to add money securely using Razorpay.');
  else if (q.data === 'orders') await bot.sendMessage(id, '📜 Open AMZ BB to view your order history.');
  else if (q.data === 'bulk') await bot.sendMessage(id, '📦 Open AMZ BB → Bulk Order to submit authorized order references.');
  await bot.answerCallbackQuery(q.id).catch(() => {});
});

bot.onText(/^\/help(?:@\w+)?$/i, msg => bot.sendMessage(msg.chat.id, `AMZ BB Help\n\n/start — Open menu\n/support — Support\n\nSupport: https://t.me/${support}`));
bot.onText(/^\/support(?:@\w+)?$/i, msg => bot.sendMessage(msg.chat.id, `🆘 Support: https://t.me/${support}`));

console.log(`AMZ BB Telegram bot @${username} is running (polling).`);
