const db = require('./database/db.js');
const { isSuperAdmin } = require('./utils/permissions.js');

module.exports = (bot) => {
  bot.command('removeadmin', (ctx) => {
    if (!isSuperAdmin(ctx.from.id)) return ctx.reply('⛔ ᴄᴏᴍᴍᴀɴᴅᴇ ʀᴇ́sᴇʀᴠᴇ́ ᴀᴜ ᴘʀᴏᴘʀɪᴇ́ᴛᴀɪʀᴇ.');

    const userId = parseInt(ctx.message.text.split(' ')[1]);
    if (!userId) return ctx.reply('❓ ᴜsᴀɢᴇ : /removeadmin <ᴜsᴇʀ_ɪᴅ>');
    if (userId.toString() === process.env.ADMIN_ID) return ctx.reply('❌ ᴠᴏᴜs ɴᴇ ᴘᴏᴜᴠᴇᴢ ᴘᴀs ᴠᴏᴜs ᴀᴜᴛᴏ ʀᴇᴛɪʀᴇʀ.');

    const admin = db.prepare('SELECT * FROM admins WHERE user_id = ?').get(userId);
    if (!admin) return ctx.reply('❌ ᴄᴇᴛ ᴜᴛɪʟɪsᴀᴛᴇᴜʀ ɴ\'ᴇsᴛ ᴘᴀs ᴀᴅᴍɪɴ.');

    db.prepare('DELETE FROM admins WHERE user_id = ?').run(userId);

    ctx.reply(`✅ ᴀᴅᴍɪɴ ${userId} ʀᴇᴛɪʀᴇ́.`);

    bot.telegram.sendMessage(userId, '🛡 ᴠᴏs ᴀᴠᴀɴᴛᴀɢᴇs ᴅ\'ᴀᴅᴍɪɴ ᴏɴᴛ ᴇ́ᴛᴇ́ ʀᴇsᴛʀᴇɪɴᴛ. ᴠᴏᴜs ɴ\'ᴇ̂ᴛᴇs ᴘʟᴜs ᴜɴ ᴀᴅᴍɪɴ.', { parse_mode: 'Markdown' }).catch(() => {});
  });
};