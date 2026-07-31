const db = require('./database/db.js');

module.exports = (bot) => {
  bot.command('profile', (ctx) => {
    const user = db.prepare('SELECT * FROM users WHERE user_id = ?').get(ctx.from.id);

    if (!user) {
      return ctx.reply('❌ ᴘʀᴏғɪʟ ɪɴᴛʀᴏᴜᴠᴀʙʟᴇ. ᴛᴀᴘᴇᴢ /start.');
    }

    ctx.reply(
      `━━━━━━━━━━━━━━━━━━━━\n👤 *𝙿𝚁𝙾𝙵𝙸𝙻 𝙳𝙴 ${user.first_name}*\n\n🪙 ᴄᴏɪɴs : *${user.coins}*\n💰 ᴛᴏᴛᴀʟ ɢᴀɢɴᴇ́ : *${user.total_earned}*\n🛒 ᴛᴏᴛᴀʟ ᴅᴇ́ᴘᴇɴsᴇ́ : *${user.total_spent}*\n👥 ғɪʟʟᴇᴜʟs : *${getReferralCount(user.user_id)}*\n📅 ɪɴsᴄʀɪᴛ ʟᴇ : ${user.joined_at}\n━━━━━━━━━━━━━━━━━━━━`,
      { parse_mode: 'Markdown' }
    );
  });

  function getReferralCount(userId) {
    const row = db.prepare('SELECT COUNT(*) as count FROM users WHERE referred_by = ?').get(userId);
    return row.count;
  }
};