const db = require('./database/db.js');
const { isSuperAdmin } = require('./utils/permissions.js');

module.exports = (bot) => {
  bot.command('addadmin', (ctx) => {
    if (!isSuperAdmin(ctx.from.id)) return ctx.reply('⛔ ᴄᴏᴍᴍᴀɴᴅᴇ ʀᴇ́sᴇʀᴠᴇ́ ᴀᴜ ᴘʀᴏᴘʀɪᴇ́ᴛᴀɪʀᴇ.');

    const args = ctx.message.text.split(' ');
    const userId = parseInt(args[1]);
    const level = args[2] || 'admin';

    if (!userId) return ctx.reply('❓ ᴜsᴀɢᴇ : /addadmin <ᴜsᴇʀ_ɪᴅ>');
    if (!['admin', 'superadmin'].includes(level)) return ctx.reply('❌ ᴜᴛɪʟɪsᴀᴛᴇᴜʀ ᴇsᴛ ᴅᴇ́ᴊᴀ̀ ᴀᴅᴍɪɴ');

    const user = db.prepare('SELECT * FROM users WHERE user_id = ?').get(userId);
    if (!user) return ctx.reply('❌ ᴜᴛɪʟɪsᴀᴛᴇᴜʀ ɪɴᴛʀᴏᴜᴠᴀʙʟᴇ.');

    const existing = db.prepare('SELECT * FROM admins WHERE user_id = ?').get(userId);
    if (existing) return ctx.reply('❌ ᴜᴛɪʟɪsᴀᴛᴇᴜʀ ᴇsᴛ ᴅᴇ́ᴊᴀ̀ ᴀᴅᴍɪɴ.');

    db.prepare('INSERT INTO admins (user_id, level, added_by) VALUES (?, ?, ?)')
      .run(userId, level, ctx.from.id);

    ctx.reply(
      `━━━━━━━━━━━━━━━━━━━━\n✅ *𝙽𝙾𝚄𝚅𝙴𝙻 𝙰𝙳𝙼𝙸𝙽 !*\n\n👤 ${user.first_name} (ɪᴅ: ${userId})\n🛡 ɴɪᴠᴇᴀᴜ : ${level}\n━━━━━━━━━━━━━━━━━━━━`,
      { parse_mode: 'Markdown' }
    );

    bot.telegram.sendMessage(userId,
      `━━━━━━━━━━━━━━━━━━━━\n🛡 *ᴠᴏᴜs ᴠᴇɴᴇᴢ ᴅ'ᴇᴛʀᴇ ᴘʀᴏᴍᴜ ᴀᴅᴍɪɴ !*\n\n👤 ɴɪᴠᴇᴀᴜ : ${level}\nᴛᴀᴘᴇᴢ /adminmenu ᴘᴏᴜʀ ᴠᴏɪʀ ᴠᴏs ᴄᴏᴍᴍᴀɴᴅᴇs.\n━━━━━━━━━━━━━━━━━━━━`,
      { parse_mode: 'Markdown' }
    ).catch(() => {});
  });
};