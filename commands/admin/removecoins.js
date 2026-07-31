const db = require('./database/db.js');
const { removeCoins, formatNumber } = require('./utils/helpers.js');

module.exports = (bot) => {
  bot.command('removecoins', (ctx) => {
    const { isAdmin } = require('./utils/permissions.js');
if (!isAdmin(ctx.from.id)) return;

    const args = ctx.message.text.split(' ');
    const userId = parseInt(args[1]);
    const amount = parseInt(args[2]);
    const reason = args.slice(3).join(' ') || 'Retrait admin';

    if (!userId || !amount || isNaN(amount) || amount <= 0) {
      return ctx.reply('❓ ᴜsᴀɢᴇ : /removecoins <ᴜsᴇʀ_ɪᴅ> <ᴍᴏɴᴛᴀɴᴛ> [ʀᴀɪsᴏɴ]');
    }

    const user = db.prepare('SELECT * FROM users WHERE user_id = ?').get(userId);
    if (!user) return ctx.reply('❌ ᴜᴛɪʟɪsᴀᴛᴇᴜʀ ɪɴᴛʀᴏᴜᴠᴀʙʟᴇ.');

    const newBalance = removeCoins(userId, amount, reason);
    if (newBalance === false) return ctx.reply('❌ sᴏʟᴅᴇ ɪɴsᴜғғɪsᴀɴᴛ ᴘᴏᴜʀ ʟᴇ ʀᴇᴛʀᴀɪᴛ.');

    ctx.reply(
      `━━━━━━━━━━━━━━━━━━━━\n✅ *𝙲𝙾𝙸𝙽𝚂 𝚁𝙴𝚃𝙸𝚁𝙴́!*\n\n👤 ${user.first_name} (ɪᴅ: ${userId})\n🪙 -${formatNumber(amount)} ᴄᴏɪɴs\n📝 ʀᴀɪsᴏɴ : ${reason}\n💰 ɴᴏᴜᴠᴇᴀᴜ sᴏʟᴅᴇ : ${formatNumber(newBalance)} coins\n━━━━━━━━━━━━━━━━━━━━`,
      { parse_mode: 'Markdown' }
    );
  });
};