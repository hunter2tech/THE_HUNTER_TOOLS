const db = require('./database/db.js');
const { isSuperAdmin } = require('./utils/permissions.js');

module.exports = (bot) => {
  bot.command('removepremium', (ctx) => {
    if (!isSuperAdmin(ctx.from.id)) return;

    const userId = parseInt(ctx.message.text.split(' ')[1]);
    if (!userId) return ctx.reply('❓ ᴜsᴀɢᴇ : /removepremium <ᴜsᴇʀ_ɪᴅ>');

    const premium = db.prepare('SELECT * FROM premium_users WHERE user_id = ?').get(userId);
    if (!premium) return ctx.reply('❌ ᴄᴇᴛ ᴜᴛɪʟɪsᴀᴛᴇᴜʀ ɴ\'ᴇsᴛ ᴘᴀs ᴘʀᴇᴍɪᴜᴍ.');

    db.prepare('DELETE FROM premium_users WHERE user_id = ?').run(userId);

    const user = db.prepare('SELECT first_name FROM users WHERE user_id = ?').get(userId);
    ctx.reply(`✅ ᴘʀᴇᴍɪᴜᴍ ʀᴇᴛɪʀᴇ́ ᴘᴏᴜʀ ${user?.first_name || userId}.`);

    bot.telegram.sendMessage(userId, '🌟 ᴠᴏᴛʀᴇ ᴀʙᴏɴɴᴇᴍᴇɴᴛ ᴘʀᴇᴍɪᴜᴍ ᴀ̀ ᴇ́ᴛᴇ́ ʀᴇ́ᴠᴏǫᴜᴇ́.', { parse_mode: 'Markdown' }).catch(() => {});
  });
};