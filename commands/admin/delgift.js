const db = require('./database/db.js');

module.exports = (bot) => {
  bot.command('delgift', (ctx) => {
    const { isSuperAdmin } = require('./utils/permissions.js');
if (!isSuperAdmin(ctx.from.id)) return;

    const code = ctx.message.text.split(' ')[1]?.toUpperCase();
    if (!code) return ctx.reply('❓ ᴜsᴀɢᴇ : /delgift <ᴄᴏᴅᴇ>');

    db.prepare('UPDATE gift_codes SET is_active = 0 WHERE code = ?').run(code);
    ctx.reply(`✅ ᴄᴏᴅᴇ \`${code}\` ᴅᴇ́sᴀᴄᴛɪᴠᴇ́.`, { parse_mode: 'Markdown' });
  });
};