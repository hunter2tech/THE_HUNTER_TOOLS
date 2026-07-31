const db = require('./database/db.js');
const { formatNumber } = require('./utils/helpers.js');

module.exports = (bot) => {
  bot.command('gifts', (ctx) => {
    const { isAdmin } = require('./utils/permissions.js');
if (!isAdmin(ctx.from.id)) return;

    const codes = db.prepare('SELECT * FROM gift_codes ORDER BY created_at DESC LIMIT 20').all();

    if (codes.length === 0) {
      return ctx.reply('🎁 ᴀᴜᴄᴜɴ ᴄᴏᴅᴇ ᴄᴀᴅᴇᴀᴜ ᴛʀᴏᴜᴠᴇ́. ᴄʀᴇ́ᴇᴢ-ᴇɴ ᴜɴ ᴀᴠᴇᴄ /gift');
    }

    let message = '━━━━━━━━━━━━━━━━━━━━\n🎁 *𝙲𝙾𝙳𝙴𝚂 𝙲𝙰𝙳𝙴𝙰𝚄𝚇*\n\n';

    for (const c of codes) {
      const status = !c.is_active ? '🔴'
        : (c.expires_at && new Date(c.expires_at) < new Date()) ? '⏰'
        : (c.uses >= c.max_uses) ? '🈵'
        : '🟢';

      message += `${status} \`${c.code}\` — ${formatNumber(c.reward)}💰\n`;
      message += `   ${c.uses}/${c.max_uses} ᴜᴛɪʟɪsᴀᴛɪᴏɴs\n`;
      if (c.expires_at) message += `   ᴇxᴘɪʀᴇ : ${new Date(c.expires_at).toLocaleDateString('fr-FR')}\n`;
      message += '\n';
    }

    ctx.reply(message, { parse_mode: 'Markdown' });
  });
};