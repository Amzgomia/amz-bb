require('dotenv').config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const username = String(process.env.TELEGRAM_BOT_USERNAME || 'bbamz_bot').replace(/^@/, '');
const support = String(process.env.SUPPORT_USERNAME || 'amzbb_support').replace(/^@/, '');
const appUrl = process.env.APP_URL || 'https://example.com';

async function tg(method, body) {
  if (!token) throw new Error('TELEGRAM_BOT_TOKEN is not configured');
  const r = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify(body)
  });
  return r.json();
}

function keyboard() {
  return { inline_keyboard: [
    [{ text: '🛒 Open AMZ BB', web_app: { url: appUrl } }],
    [{ text: '💰 Wallet', callback_data: 'wallet' }, { text: '📜 Orders', callback_data: 'orders' }],
    [{ text: '📦 Bulk Order', callback_data: 'bulk' }, { text: '🆘 Support', callback_data: 'support' }]
  ]};
}

async function handleUpdate(update) {
  if (update.message) {
    const msg = update.message;
    const text = String(msg.text || '').trim();
    const command = text.split(/\s+/)[0].split('@')[0].toLowerCase();
    if (command === '/start' || command === '/menu') {
      await tg('sendMessage', {
        chat_id: msg.chat.id,
        text: '🛒 *Welcome to AMZ BB!*\n\n⚡ Fast • Easy • Secure\n\nUse the button below to open the shopping panel.\n\n💰 Wallet: ₹0.00\n📦 Orders: Manage from the panel.',
        parse_mode: 'Markdown', reply_markup: keyboard()
      });
    } else if (command === '/help') {
      await tg('sendMessage', { chat_id: msg.chat.id, text: `AMZ BB Help\n\n/start — Open menu\n/support — Support\n\nSupport: https://t.me/${support}` });
    } else if (command === '/support') {
      await tg('sendMessage', { chat_id: msg.chat.id, text: `🆘 Support: https://t.me/${support}` });
    }
  }

  if (update.callback_query) {
    const q = update.callback_query;
    const id = q.message?.chat?.id;
    if (q.data === 'support') await tg('sendMessage', { chat_id: id, text: `🆘 Support: https://t.me/${support}` });
    else if (q.data === 'wallet') await tg('sendMessage', { chat_id: id, text: '💳 Open AMZ BB to add money securely using Razorpay.' });
    else if (q.data === 'orders') await tg('sendMessage', { chat_id: id, text: '📜 Open AMZ BB to view your order history.' });
    else if (q.data === 'bulk') await tg('sendMessage', { chat_id: id, text: '📦 Open AMZ BB → Bulk Order to submit authorized order references.' });
    await tg('answerCallbackQuery', { callback_query_id: q.id }).catch(() => {});
  }
}

async function setupWebhook() {
  if (!token) {
    console.log('Telegram bot disabled: TELEGRAM_BOT_TOKEN is not configured.');
    return;
  }
  const url = `${String(appUrl).replace(/\/$/, '')}/telegram/webhook`;
  const result = await tg('setWebhook', { url, drop_pending_updates: false });
  console.log(`AMZ BB Telegram webhook @${username}: ${result.ok ? 'enabled' : 'failed'} -> ${url}`);
}

module.exports = { handleUpdate, setupWebhook };

if (require.main === module) setupWebhook().catch(e => { console.error(e.message); process.exit(1); });
