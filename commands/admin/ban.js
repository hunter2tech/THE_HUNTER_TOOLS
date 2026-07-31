const db = require('./database/db.js');

module.exports = (bot) => {
  bot.command('ban', (ctx) => {
    const { isSuperAdmin } = require('./utils/permissions.js');
if (!isSuperAdmin(ctx.from.id)) return;

    const args = ctx.message.text.split(' ');
    const userId = parseInt(args[1]);
    const reason = args.slice(2).join(' ') || 'Aucune raison';

    if (!userId) return ctx.reply('❓ ᴜsᴀɢᴇ : /ban <ᴜsᴇʀ_ɪᴅ> [ʀᴀɪsᴏɴ]');

    const user = db.prepare('SELECT * FROM users WHERE user_id = ?').get(userId);
    if (!user) return ctx.reply('❌ ᴜᴛɪʟɪsᴀᴛᴇᴜʀ ɪɴᴛʀᴏᴜᴠᴀʙʟᴇ.');

    const alreadyBanned = db.prepare('SELECT * FROM banned_users WHERE user_id = ?').get(userId);
    if (alreadyBanned) return ctx.reply('❌ ᴜᴛɪʟɪsᴀᴛᴇᴜʀ ᴅᴇ́ᴊᴀ̀ ʙᴀɴɴɪ.');

    db.prepare('INSERT INTO banned_users (user_id, reason) VALUES (?, ?)').run(userId, reason);

    ctx.reply(
      `━━━━━━━━━━━━━━━━━━━━\n🚫 *ᴜᴛɪʟɪsᴀᴛᴇᴜʀ ʙᴀɴɴɪ !*\n\n👤 ${user.first_name} (ɪᴅ: ${userId})\n📝 ʀᴀɪsᴏɴ : ${reason}\n━━━━━━━━━━━━━━━━━━━━`,
      { parse_mode: 'Markdown' }
    );

    bot.telegram.sendMessage(userId,
      `━━━━━━━━━━━━━━━━━━━━\n🚫 *ᴠᴏᴜs ᴀᴠᴇᴢ ᴇ́ᴛᴇ́ ʙᴀɴɴɪ ᴅᴜ ʙᴏᴛ*\n\n📝 ʀᴀɪsᴏɴ : ${reason}\n\nᴄᴏɴᴛᴀᴄᴛᴇᴢ ʟᴇ ᴅᴇᴠ ᴘᴏᴜʀ ᴇɴ sᴀᴠᴏɪʀ ᴘʟᴜs.\n━━━━━━━━━━━━━━━━━━━━`,
      { parse_mode: 'Markdown' }
    ).catch(() => {});
  });
};