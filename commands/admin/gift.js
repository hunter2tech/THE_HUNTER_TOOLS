const db = require('./database/db.js');
const { formatNumber } = require('./utils/helpers.js');

module.exports = (bot) => {
  bot.command('gift', (ctx) => {
    const { isAdmin } = require('./utils/permissions.js');
if (!isAdmin(ctx.from.id)) return;

    const args = ctx.message.text.split('|').map(s => s.trim());

    if (args.length < 2) {
      return ctx.reply(
        `━━━━━━━━━━━━━━━━━━━━\n🎁 *𝙲𝚁𝙴́𝙴𝚁 𝚄𝙽 𝙲𝙾𝙳𝙴 𝙲𝙰𝙳𝙴𝙰𝚄*\n\nғᴏʀᴍᴀᴛ : /gift CODE | MONTANT | MAX_USES | JOURS_VALIDITÉ\n\n*ᴇxᴇᴍᴘʟᴇ :* \`/gift BONUS2026 | 500 | 100 | 7\`\n→ 500 ᴄᴏɪɴs, 100 ᴜᴛɪʟɪsᴀᴛɪᴏɴs, ᴇxᴘɪʀᴇ ᴅᴀɴs 7 ᴊᴏᴜʀs\n━━━━━━━━━━━━━━━━━━━━`,
        { parse_mode: 'Markdown' }
      );
    }

    const code = args[0].toUpperCase().trim();
    const reward = parseInt(args[1]) || 0;
    const maxUses = parseInt(args[2]) || 1;
    const daysValid = parseInt(args[3]) || 0;

    if (!code || reward <= 0) return ctx.reply('❌ ᴄᴏᴅᴇ ᴏᴜ ᴍᴏɴᴛᴀɴᴛ ɪɴᴠᴀʟɪᴅᴇ.');

    const existing = db.prepare('SELECT * FROM gift_codes WHERE code = ?').get(code);
    if (existing) return ctx.reply('❌ ᴄᴇ ᴄᴏᴅᴇ ᴇxɪsᴛᴇ ᴅᴇ́ᴊᴀ̀.');

    const expiresAt = daysValid > 0
      ? new Date(Date.now() + daysValid * 24 * 60 * 60 * 1000).toISOString()
      : null;

    db.prepare('INSERT INTO gift_codes (code, reward, max_uses, expires_at) VALUES (?, ?, ?, ?)')
      .run(code, reward, maxUses, expiresAt);

    ctx.reply(
      `━━━━━━━━━━━━━━━━━━━━\n🎁 *𝙲𝙾𝙳𝙴 𝙲𝙰𝙳𝙴𝙰𝚄 𝙲𝚁𝙴́𝙴́ !*\n\n🔑 ᴄᴏᴅᴇ : \`${code}\`\n💰 ʀᴇ́ᴄᴏᴍᴘᴇɴsᴇ : ${formatNumber(reward)} ᴄᴏɪɴs\n👥 ᴜᴛɪʟɪsᴀᴛɪᴏɴs ᴍᴀx : ${maxUses}\n📅 ᴇxᴘɪʀᴇ : ${expiresAt ? new Date(expiresAt).toLocaleDateString('fr-FR') : 'ᴊᴀᴍᴀɪs'}\n\nʟᴇs ᴜᴛɪʟɪsᴀᴛᴇᴜʀs ᴘᴇᴜᴠᴇɴᴛ ᴜᴛɪʟɪsᴇʀ \`/claim ${code}\`\n━━━━━━━━━━━━━━━━━━━━`,
      { parse_mode: 'Markdown' }
    );
  });
};