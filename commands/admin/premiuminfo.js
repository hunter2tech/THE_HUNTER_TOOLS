const db = require('./database/db.js');
const { isAdmin } = require('./utils/permissions.js');

module.exports = (bot) => {
  bot.command('premiuminfo', (ctx) => {
    if (!isAdmin(ctx.from.id)) return;

    const userId = parseInt(ctx.message.text.split(' ')[1]) || ctx.from.id;
    const user = db.prepare('SELECT * FROM users WHERE user_id = ?').get(userId);
    if (!user) return ctx.reply('❌ ᴜᴛɪʟɪsᴀᴛᴇᴜʀ ɪɴᴛʀᴏᴜᴠᴀʙʟᴇ.');

    const premium = db.prepare('SELECT * FROM premium_users WHERE user_id = ?').get(userId);
    if (!premium) {
      return ctx.reply(`👤 ${user.first_name} ɴ'ᴇsᴛ ᴘᴀs ᴜɴ ᴜᴛɪʟɪsᴀᴛᴇᴜʀ ᴘʀᴇᴍɪᴜᴍ.`);
    }

    const untilStr = premium.premium_until
      ? new Date(premium.premium_until).toLocaleDateString('fr-FR')
      : 'Permanent (illimité)';
    const status = premium.premium_until && new Date(premium.premium_until) < new Date() ? 'Expiré' : 'Actif';

    ctx.reply(
      `━━━━━━━━━━━━━━━━━━━━\n🌟 *𝙸𝙽𝙵𝙾𝚂 𝙳𝚄 𝙿𝚁𝙴𝙼𝙸𝚄𝙼*\n\n👤 ${user.first_name} (ɪᴅ: ${userId})\n📅 ᴇxᴘɪʀᴀᴛɪᴏɴ : ${untilStr}\n🟢 sᴛᴀᴛᴜᴛ : ${status}\n🛡 ᴀᴄᴛɪᴠᴇ́ ᴘᴀʀ : ${premium.activated_by}\n━━━━━━━━━━━━━━━━━━━━`,
      { parse_mode: 'Markdown' }
    );
  });
};