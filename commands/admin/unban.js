const db = require('./database/db.js');

module.exports = (bot) => {
  bot.command('unban', (ctx) => {
    const { isSuperAdmin } = require('./utils/permissions.js');
if (!isSuperAdmin(ctx.from.id)) return;

    const userId = parseInt(ctx.message.text.split(' ')[1]);
    if (!userId) return ctx.reply('❓ ᴜsᴀɢᴇ : /unban <ᴜsᴇʀ_ɪᴅ>');

    const banned = db.prepare('SELECT * FROM banned_users WHERE user_id = ?').get(userId);
    if (!banned) return ctx.reply('❌ ᴄᴇᴛ ᴜᴛɪʟɪsᴀᴛᴇᴜʀ ɴ\'ᴇsᴛ ᴘᴀs ʙᴀɴɴɪ.');

    db.prepare('DELETE FROM banned_users WHERE user_id = ?').run(userId);

    const user = db.prepare('SELECT * FROM users WHERE user_id = ?').get(userId);

    ctx.reply(
      `━━━━━━━━━━━━━━━━━━━━\n✅ *ᴜᴛɪʟɪsᴀᴛᴇᴜʀ ᴅᴇ́ʙᴀɴɴɪ !*\n\n` +
      `👤 ${user?.first_name || 'Inconnu'} (ɪᴅ: ${userId})\n━━━━━━━━━━━━━━━━━━━━`,
      { parse_mode: 'Markdown' }
    );

    bot.telegram.sendMessage(userId,
      '━━━━━━━━━━━━━━━━━━━━\n✅ *𝚅𝙾𝚄𝚂 𝙰𝚅𝙴𝚉 𝙴́𝚃𝙴́ 𝙳𝙴𝙱𝙰𝙽𝙽𝙸*\n\nᴠᴏᴜs ᴘᴏᴜᴠᴇᴢ ᴀ̀ ɴᴏᴜᴠᴇᴀᴜ ᴜᴛɪʟɪsᴇʀ ʟᴇ ʙᴏᴛ.\nʀᴀssᴜʀᴇᴢ ᴠᴏᴜs ᴅᴇ ɴᴇ ᴘᴀs ᴀʙᴜsᴇʀ ᴅᴜ ʙᴏᴛ ᴇᴛ ᴅ\'ᴇ̂ᴛʀᴇ ᴜɴ ᴜᴛɪʟɪsᴀᴛᴇᴜʀ ᴇxᴀᴍᴘʟᴀɪʀᴇ.\nᴍᴇʀᴄɪ ᴀ ᴠᴏᴜs\n\nᴛʜᴇ ʜᴜɴᴛᴇʀ ᴢᴏɴᴇ • ᴄᴏᴘʏʀɪɢʜᴛ 2026\n━━━━━━━━━━━━━━━━━━━━',
      { parse_mode: 'Markdown' }
    ).catch(() => {});
  });
};