const db = require('./database/db.js');

module.exports = (bot) => {
  bot.command('referral', (ctx) => {
    const user = db.prepare('SELECT * FROM users WHERE user_id = ?').get(ctx.from.id);
    if (!user) return ctx.reply('❌ ᴛᴀᴘᴇᴢ /start ᴅ\'ᴀʙᴏʀᴅ.');

    const botUsername = ctx.botInfo.username;
    const refLink = `https://t.me/${botUsername}?start=${user.ref_code}`;
    const count = db.prepare('SELECT COUNT(*) as count FROM users WHERE referred_by = ?').get(user.user_id).count;

    ctx.reply(
      `━━━━━━━━━━━━━━━━━━━━\n👥 *𝙸𝙽𝙵𝙾 𝙿𝙰𝚁𝚁𝙰𝙸𝙽𝙰𝙶𝙴*\n\n🔗 ʟɪᴇɴ : \`${refLink}\`\n👤 ғɪʟʟᴇᴜʟs : *${count}*\n💰 ɢᴀɪɴ ᴘᴀʀ ғɪʟʟᴇᴜʟ : *50 coins*\n\nᴘᴀʀᴛᴀɢᴇᴢ ᴄᴇ ʟɪᴇɴ ᴇᴛ ɢᴀɢɴᴇᴢ ᴅᴇs ᴄᴏɪɴs ǫᴜᴀɴᴅ ᴠᴏs ᴀᴍɪs ʀᴇᴊᴏɪɢɴᴇɴᴛ !\n━━━━━━━━━━━━━━━━━━━━`,
      { parse_mode: 'Markdown' }
    );
  });
};