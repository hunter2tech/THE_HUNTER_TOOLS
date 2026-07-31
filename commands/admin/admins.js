const db = require('./database/db.js');
const { isSuperAdmin } = require('./utils/permissions.js');

module.exports = (bot) => {
  bot.command('admins', (ctx) => {
    if (!isSuperAdmin(ctx.from.id)) return;

    const admins = db.prepare('SELECT * FROM admins ORDER BY level DESC, added_at ASC').all();

    if (admins.length === 0) {
      return ctx.reply('📋 ᴀᴜᴄᴜɴ ᴀᴅᴍɪɴ ɪᴅᴇɴᴛɪғɪᴇ́.');
    }

    let message = '━━━━━━━━━━━━━━━━━━━━\n🛡 *𝙻𝙸𝚂𝚃𝙴 𝙳𝙴𝚂 𝙰𝙳𝙼𝙸𝙽𝚂*\n\n';
    for (const a of admins) {
      const user = db.prepare('SELECT first_name, username FROM users WHERE user_id = ?').get(a.user_id);
      const name = user ? `${user.first_name}${user.username ? ' (@' + user.username + ')' : ''}` : 'Inconnu';
      const emoji = a.level === 'superadmin' ? '👑' : '🛡';
      message += `${emoji} ${name} — *${a.level}*\n`;
      message += `   ɪᴅ: ${a.user_id}\n\n`;
    }

    ctx.reply(message, { parse_mode: 'Markdown' });
  });
};