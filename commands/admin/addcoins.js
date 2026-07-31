const db = require('./database/db.js');
const { addCoins, formatNumber } = require('./utils/helpers.js');

module.exports = (bot) => {
  bot.command('addcoins', (ctx) => {
    const { isAdmin } = require('./utils/permissions.js');
if (!isAdmin(ctx.from.id)) return;

    const args = ctx.message.text.split(' ');
    const userId = parseInt(args[1]);
    const amount = parseInt(args[2]);
    const reason = args.slice(3).join(' ') || 'Ajout admin';

    if (!userId || !amount || isNaN(amount) || amount <= 0) {
      return ctx.reply('❓ ᴜsᴀɢᴇ : /addcoins <ᴜsᴇʀ_ɪᴅ> <ᴍᴏɴᴛᴀɴᴛ> [ʀᴀɪsᴏɴ]');
    }

    const user = db.prepare('SELECT * FROM users WHERE user_id = ?').get(userId);
    if (!user) return ctx.reply('❌ ᴜᴛɪʟɪsᴀᴛᴇᴜʀ ɪɴᴛʀᴏᴜᴠᴀʙʟᴇ.');

    const newBalance = addCoins(userId, amount, 'admin', reason);

    ctx.reply(
      `━━━━━━━━━━━━━━━━━━━━\n✅ *ᴄᴏɪɴs ᴀᴊᴏᴜᴛᴇ́s !*\n\n👤 ${user.first_name} (ɪᴅ: ${userId})\n🪙 +${formatNumber(amount)} ᴄᴏɪɴs\n📝 ʀᴀɪsᴏɴ : ${reason}\n💰 ɴᴏᴜᴠᴇᴀᴜ solde : ${formatNumber(newBalance)} ᴄᴏɪɴs\n━━━━━━━━━━━━━━━━━━━━`,
      { parse_mode: 'Markdown' }
    );

    bot.telegram.sendMessage(userId,
      `━━━━━━━━━━━━━━━━━━━━\n🎁 *ᴠᴏᴜs ᴀᴠᴇᴢ ʀᴇᴄ̧ᴜ ᴅᴇs ᴄᴏɪɴs !*\n\n🪙 +${formatNumber(amount)} ᴄᴏɪɴs\n📝 ${reason}\n💰 ɴᴏᴜᴠᴇᴀᴜ sᴏʟᴅᴇ : ${formatNumber(newBalance)} ᴄᴏɪɴs\n━━━━━━━━━━━━━━━━━━━━`,
      { parse_mode: 'Markdown' }
    ).catch(() => {});
  });
};